// /lib/api.js
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

    // Generic request handler
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        // Get token from cookie
        const token = this.getTokenFromCookie();

        const config = {
            ...options,
            headers: {
                ...this.headers,
                ...options.headers,
            },
            credentials: 'include', // Important for cookies
        };

        // Add token if exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                // Clear cookie
                if (typeof document !== 'undefined') {
                    document.cookie = 'token=; path=/; max-age=0';
                }

                // If in browser, redirect to login
                if (typeof window !== 'undefined') {
                    window.location.href = '/signin';
                }

                throw new Error("Session expired. Please login again.");
            }

            // Parse response
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // Handle errors
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

    // GET request
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    // POST request
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    // Upload file
    async upload(endpoint, formData, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        // Get token from cookie
        const token = this.getTokenFromCookie();

        const config = {
            ...options,
            method: 'POST',
            headers: {
                ...this.headers,
                ...options.headers,
            },
            body: formData,
        };

        // Add token if exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Remove Content-Type for FormData
        delete config.headers['Content-Type'];

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }
}

// Create singleton instance
export const api = new ApiClient();