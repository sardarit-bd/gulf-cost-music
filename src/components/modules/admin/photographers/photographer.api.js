const API = process.env.NEXT_PUBLIC_BASE_URL;

// ==========================
// Get auth token - FIXED VERSION
// ==========================
const getToken = () => {
    if (typeof window === "undefined") return null;

    // Try different ways to get token
    let token = null;

    // 1. Check localStorage first
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    }

    // 2. Check cookies
    if (!token && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;)\s*token=([^;]+)/);
        if (match) token = match[1];
    }

    // 3. Check sessionStorage
    if (!token && typeof sessionStorage !== "undefined") {
        token = sessionStorage.getItem("token");
    }

    return token;
};

// ==========================
// Safe JSON parse with better error handling
// ==========================
const safeJson = async (res) => {
    const text = await res.text();

    if (!text) {
        throw new Error("Empty response from server");
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Non-JSON response:", text);

        // Check if it's an HTML error page
        if (text.includes("<!DOCTYPE html>") || text.includes("<html>")) {
            throw new Error("Server returned HTML instead of JSON. Check API endpoint.");
        }

        // If it's plain text error
        if (text.startsWith("Error:")) {
            throw new Error(text);
        }

        throw new Error("Invalid JSON response from server");
    }
};

// ==========================
// Generic fetch with auth
// ==========================
const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
        throw new Error("Authentication required. Please login again.");
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
        cache: "no-store",
    };

    try {
        const res = await fetch(url, config);

        // Handle 401 Unauthorized
        if (res.status === 401) {
            // Clear auth data
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }

            throw new Error("Session expired. Please login again.");
        }

        return res;
    } catch (error) {
        if (error.message.includes("Failed to fetch")) {
            throw new Error("Network error. Please check your connection.");
        }
        throw error;
    }
};

// ==========================
// Fetch photographers for admin
// ==========================
export const fetchPhotographersForAdmin = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page: String(filters.page || 1),
            limit: String(filters.limit || 10),
            ...(filters.status && filters.status !== "all" ? { status: filters.status } : {}),
            ...(filters.search ? { search: filters.search } : {}),
            ...(filters.plan && filters.plan !== "all" ? { plan: filters.plan } : {}),
            ...(filters.sort ? { sort: filters.sort } : {}),
            ...(filters.verified && filters.verified !== "all" ? { verified: filters.verified === "verified" } : {}),
        });

        const res = await fetchWithAuth(
            `${API}/api/photographers/admin/photographers?${queryParams.toString()}`
        );

        const data = await safeJson(res);

        if (!res.ok) {
            throw new Error(data?.message || `Server error: ${res.status}`);
        }

        return {
            content: data.data?.photographers || [],
            stats: data.data?.stats || {
                total: 0,
                pro: 0,
                free: 0,
                active: 0,
                inactive: 0
            },
            pagination: data.data?.pagination || {
                current: 1,
                pages: 1,
                total: 0
            },
        };
    } catch (error) {
        console.error("Error fetching photographers:", error);
        throw error;
    }
};

// ==========================
// Toggle photographer active/inactive
// ==========================
export const togglePhotographerStatus = async (photographerId, currentStatus) => {
    try {
        const res = await fetchWithAuth(
            `${API}/api/photographers/photographers/${photographerId}/toggle`,
            {
                method: "PUT",
                body: JSON.stringify({ isActive: !currentStatus }),
            }
        );

        const data = await safeJson(res);

        if (!res.ok) {
            throw new Error(data?.message || "Failed to update photographer status");
        }

        return data.data;
    } catch (error) {
        console.error("Error toggling photographer status:", error);
        throw error;
    }
};

// ==========================
// Change photographer plan (ADMIN)
// ==========================
export const changePhotographerPlan = async (photographerId, newPlan, options = {}) => {
    try {
        const res = await fetchWithAuth(
            `${API}/api/photographers/admin/${photographerId}/plan`,
            {
                method: "PUT",
                body: JSON.stringify({
                    subscriptionPlan: newPlan,
                    notifyUser: options.sendNotification !== false,
                }),
            }
        );

        const data = await safeJson(res);

        if (!res.ok) {
            throw new Error(data?.message || data?.error?.message || "Failed to change photographer plan");
        }

        return data.data;
    } catch (error) {
        console.error("Error changing photographer plan:", error);
        throw error;
    }
};

// ==========================
// Delete photographer (ADMIN)
// ==========================
export const deletePhotographer = async (photographerId) => {
    try {
        const res = await fetchWithAuth(
            `${API}/api/photographers/photographers/${photographerId}`,
            {
                method: "DELETE",
            }
        );

        const data = await safeJson(res);

        if (!res.ok) {
            throw new Error(data?.message || "Failed to delete photographer");
        }

        return data;
    } catch (error) {
        console.error("Error deleting photographer:", error);
        throw error;
    }
};

// ==========================
// Get single photographer details (ADMIN)
// ==========================
export const getPhotographerDetails = async (photographerId) => {
    try {
        const res = await fetchWithAuth(
            `${API}/api/photographers/photographers/${photographerId}`
        );

        const data = await safeJson(res);

        if (!res.ok) {
            throw new Error(data?.message || "Failed to fetch photographer details");
        }

        return data.data;
    } catch (error) {
        console.error("Error fetching photographer details:", error);
        throw error;
    }
};