const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const getToken = () => {
    if (typeof document !== "undefined") {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];
    }
    return null;
};

const getHeaders = (isFormData = false) => {
    const token = getToken();
    const headers = {};

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};
export const api = {
    getMyArtistProfile: () =>
        fetch(`${API_URL}/api/artists/profile/me`, { headers: getHeaders() }).then(
            async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
                return data;
            }
        ),

    updateArtistProfile: (formData) => {
        return fetch(`${API_URL}/api/artists/profile`, {
            method: "POST",
            headers: getHeaders(true),
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update profile");
            return data;
        });
    },

    getMyMarketItem: () =>
        fetch(`${API_URL}/api/market/me`, { headers: getHeaders() }).then(
            async (res) => {
                const data = await res.json();
                if (!res.ok)
                    throw new Error(data.message || "Failed to fetch market item");
                return data;
            }
        ),

    createMarketItem: (formData) => {
        return fetch(`${API_URL}/api/market/me`, {
            method: "POST",
            headers: getHeaders(true),
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create listing");
            return data;
        });
    },

    updateMarketItem: (formData) => {
        return fetch(`${API_URL}/api/market/me`, {
            method: "PUT",
            headers: getHeaders(true),
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update listing");
            return data;
        });
    },

    deleteMarketItem: () =>
        fetch(`${API_URL}/api/market/me`, {
            method: "DELETE",
            headers: getHeaders(),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete listing");
            return data;
        }),

    deleteMarketPhoto: (index) =>
        fetch(`${API_URL}/api/market/me/photos/${index}`, {
            method: "DELETE",
            headers: getHeaders(),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete photo");
            return data;
        }),

    // Billing
    getBillingStatus: () =>
        fetch(`${API_URL}/api/subscription/status`, { headers: getHeaders() }).then(
            async (res) => {
                const data = await res.json();
                if (!res.ok)
                    throw new Error(data.message || "Failed to fetch billing status");
                return data;
            }
        ),

    createCheckoutSession: () =>
        fetch(`${API_URL}/api/subscription/checkout/pro`, {
            method: "POST",
            headers: getHeaders(),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create checkout");
            return data;
        }),

    createBillingPortal: () =>
        fetch(`${API_URL}/api/subscription/portal`, {
            method: "POST",
            headers: getHeaders(),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to create billing portal");
            return data;
        }),

    cancelSubscription: () =>
        fetch(`${API_URL}/api/subscription/cancel`, {
            method: "POST",
            headers: getHeaders(),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to cancel subscription");
            return data;
        }),

    resumeSubscription: () =>
        fetch(`${API_URL}/api/subscription/resume`, {
            method: "POST",
            headers: getHeaders(),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to resume subscription");
            return data;
        }),

    getInvoices: () =>
        fetch(`${API_URL}/api/subscription/invoices`, {
            headers: getHeaders(),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch invoices");
            return data;
        }),
};