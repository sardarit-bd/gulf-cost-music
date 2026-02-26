// lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

class ApiClient {
    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    getTokenFromCookie() {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find(row => row.startsWith('token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getTokenFromCookie();

        const config = {
            ...options,
            headers: {
                ...this.headers,
                ...options.headers,
            },
            credentials: 'include',
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                if (typeof document !== 'undefined') {
                    document.cookie = 'token=; path=/; max-age=0';
                    document.cookie = 'role=; path=/; max-age=0';
                    document.cookie = 'user=; path=/; max-age=0';
                }
                // Don't throw immediately, let the calling code handle it
                const error = new Error("Session expired");
                error.status = 401;
                throw error;
            }

            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || `HTTP ${response.status}`);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    async upload(endpoint, formData, method = 'POST', options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getTokenFromCookie();

        const config = {
            ...options,
            method,
            headers: {
                ...options.headers,
            },
            body: formData,
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Remove Content-Type header so browser sets it with boundary
        delete config.headers['Content-Type'];

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || `HTTP ${response.status}`);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }

    // Helper to check if user is authenticated
    isAuthenticated() {
        return !!this.getTokenFromCookie();
    }

    // Helper to logout
    logout() {
        if (typeof document !== 'undefined') {
            document.cookie = 'token=; path=/; max-age=0';
            document.cookie = 'role=; path=/; max-age=0';
            document.cookie = 'user=; path=/; max-age=0';
        }
    }
}

export const api = new ApiClient();