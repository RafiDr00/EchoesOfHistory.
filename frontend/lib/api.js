/**
 * Enterprise API Client for Echoes of History
 * Standardizes error handling, authentication, and telemetry tracking.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_VERSION = '/api/v1';

class ApiClient {
    constructor() {
        this.baseUrl = `${API_BASE_URL}${API_VERSION}`;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle unauthenticated state
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    // Optional: redirect to login if not on public pages
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.detail || 'An unexpected error occurred',
                    data,
                };
            }

            return data;
        } catch (error) {
            console.error(`[API Error] ${endpoint}:`, error);
            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`${endpoint}${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
        });
    }

    async post(endpoint, body = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }
}

export const api = new ApiClient();
export default api;
