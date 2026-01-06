const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

// Function to get cookie value by name
export const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

// Fetch hero data
export const fetchHeroData = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/hero-video`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || "Failed to load data");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Failed to load hero section.");
    }
};

// Save hero data
export const saveHeroData = async (heroData) => {
    const token = getCookie("token");

    if (!token) {
        throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${API_BASE}/api/hero-video/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(heroData),
    });

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.message || "Failed to save");
    }

    return result;
};