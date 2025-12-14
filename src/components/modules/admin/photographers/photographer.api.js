const API = process.env.NEXT_PUBLIC_BASE_URL;

// ==========================
// Get auth token (FIX: define it)
// ==========================
const getToken = () => {
    if (typeof document === "undefined") return null;
    return document.cookie.match(/token=([^;]+)/)?.[1] || null;
};

// ==========================
// Safe JSON parse (fix Unexpected token '<')
// ==========================
const safeJson = async (res) => {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Non-JSON response:", text);
        throw new Error("Server returned invalid JSON (maybe wrong route or server error).");
    }
};

// ==========================
// Fetch photographers for admin
// GET /api/photographers/admin/photographers
// ==========================
export const fetchPhotographersForAdmin = async (filters = {}) => {
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    const queryParams = new URLSearchParams({
        page: String(filters.page || 1),
        limit: String(filters.limit || 10),
        ...(filters.status && filters.status !== "all" ? { status: filters.status } : {}),
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.plan && filters.plan !== "all" ? { plan: filters.plan } : {}),
    });

    const res = await fetch(
        `${API}/api/photographers/admin/photographers?${queryParams.toString()}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch photographers");
    }

    return {
        content: data.data?.photographers || [],
        stats: data.data?.stats || { total: 0, pro: 0, free: 0, active: 0, inactive: 0 },
        pagination: data.data?.pagination || { current: 1, pages: 1, total: 0 },
    };
};

// ==========================
// Toggle photographer active/inactive
// PUT /api/photographers/photographers/:id/toggle
// ==========================
export const togglePhotographerStatus = async (photographerId, currentStatus) => {
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    const res = await fetch(
        `${API}/api/photographers/photographers/${photographerId}/toggle`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive: !currentStatus }),
        }
    );

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data?.message || "Failed to update photographer status");
    }

    return data.data;
};

// ==========================
// Change photographer plan (ADMIN)
// PUT /api/photographers/admin/:id/plan  ✅ (your router)
// ==========================
export const changePhotographerPlan = async (photographerId, newPlan) => {
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    const res = await fetch(
        `${API}/api/photographers/admin/${photographerId}/plan`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                subscriptionPlan: newPlan,
                notifyUser: true,
            }),
        }
    );

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data?.message || "Failed to change photographer plan");
    }

    return data.data;
};

// ==========================
// Delete photographer (ADMIN)
// DELETE /api/photographers/photographers/:id
// ==========================
export const deletePhotographer = async (photographerId) => {
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    const res = await fetch(
        `${API}/api/photographers/photographers/${photographerId}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data?.message || "Failed to delete photographer");
    }

    return data;
};

// ==========================
// Get single photographer details (ADMIN)
// GET /api/photographers/photographers/:id
// ==========================
export const getPhotographerDetails = async (photographerId) => {
    const token = getToken();
    if (!token) throw new Error("Authentication token not found");

    const res = await fetch(
        `${API}/api/photographers/photographers/${photographerId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    const data = await safeJson(res);

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch photographer details");
    }

    return data.data;
};
