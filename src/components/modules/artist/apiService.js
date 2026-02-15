const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const getToken = () => {
    if (typeof window !== "undefined") {
        // Try to get from cookie
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find(row => row.startsWith("token="));
        if (tokenCookie) {
            return tokenCookie.split("=")[1];
        }

        // Try to get from localStorage as fallback
        try {
            return localStorage.getItem("token");
        } catch {
            return null;
        }
    }
    return null;
};

const getHeaders = (isFormData = false) => {
    const token = getToken();
    const headers = {};

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

// Helper function to handle responses
const handleResponse = async (res) => {
    let data;

    try {
        data = await res.json();
    } catch {
        data = { message: "Invalid response from server" };
    }

    if (!res.ok) {
        // Extract error message properly
        let errorMessage = "Request failed";

        if (data.message) {
            errorMessage = data.message;
        } else if (data.error) {
            errorMessage = data.error;
        } else if (typeof data === 'string') {
            errorMessage = data;
        } else {
            errorMessage = `HTTP Error ${res.status}`;
        }

        // If there are validation details, log them
        if (data.details) {
            console.error("Validation details:", data.details);
        }

        const error = new Error(errorMessage);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
};

export const api = {
    // Artist Profile
    getMyArtistProfile: async () => {
        try {
            const res = await fetch(`${API_URL}/api/artists/profile/me`, {
                method: "GET",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (getMyArtistProfile):", error);
            throw error;
        }
    },

    updateArtistProfile: async (formData) => {
        try {
            const res = await fetch(`${API_URL}/api/artists/profile`, {
                method: "POST",
                headers: getHeaders(true), // true for FormData (no Content-Type)
                body: formData,
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (updateArtistProfile):", error);
            throw error;
        }
    },

    // Market Items
    getMyMarketItem: async () => {
        try {
            const res = await fetch(`${API_URL}/api/market/me`, {
                method: "GET",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (getMyMarketItem):", error);
            throw error;
        }
    },

    createMarketItem: async (formData) => {
        try {
            const res = await fetch(`${API_URL}/api/market/me`, {
                method: "POST",
                headers: getHeaders(true),
                body: formData,
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (createMarketItem):", error);
            throw error;
        }
    },

    updateMarketItem: async (formData) => {
        try {
            const res = await fetch(`${API_URL}/api/market/me`, {
                method: "PUT",
                headers: getHeaders(true),
                body: formData,
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (updateMarketItem):", error);
            throw error;
        }
    },

    deleteMarketItem: async () => {
        try {
            const res = await fetch(`${API_URL}/api/market/me`, {
                method: "DELETE",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (deleteMarketItem):", error);
            throw error;
        }
    },

    deleteMarketPhoto: async (index) => {
        try {
            const res = await fetch(`${API_URL}/api/market/me/photos/${index}`, {
                method: "DELETE",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (deleteMarketPhoto):", error);
            throw error;
        }
    },

    // Billing
    getBillingStatus: async () => {
        try {
            const res = await fetch(`${API_URL}/api/subscription/status`, {
                method: "GET",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (getBillingStatus):", error);
            throw error;
        }
    },

    createCheckoutSession: async () => {
        try {
            const res = await fetch(`${API_URL}/api/subscription/checkout/pro`, {
                method: "POST",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (createCheckoutSession):", error);
            throw error;
        }
    },

    createBillingPortal: async () => {
        try {
            const res = await fetch(`${API_URL}/api/subscription/portal`, {
                method: "POST",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (createBillingPortal):", error);
            throw error;
        }
    },

    cancelSubscription: async () => {
        try {
            const res = await fetch(`${API_URL}/api/subscription/cancel`, {
                method: "POST",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (cancelSubscription):", error);
            throw error;
        }
    },

    resumeSubscription: async () => {
        try {
            const res = await fetch(`${API_URL}/api/subscription/resume`, {
                method: "POST",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (resumeSubscription):", error);
            throw error;
        }
    },

    getInvoices: async () => {
        try {
            const res = await fetch(`${API_URL}/api/subscription/invoices`, {
                method: "GET",
                headers: getHeaders(false),
                credentials: 'include'
            });
            return await handleResponse(res);
        } catch (error) {
            console.error("API Error (getInvoices):", error);
            throw error;
        }
    },
};