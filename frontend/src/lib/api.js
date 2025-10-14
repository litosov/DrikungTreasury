// Central place for API/base URLs.
// Priority:
// 1. VITE_API_BASE env (set at build time)
// 2. If running on same origin as backend (single service) -> relative ''
// 3. Fallback to localhost:4000 for local dev.

const envBase = import.meta?.env?.VITE_API_BASE;

// If env not provided, decide based on hostname.
let derived = '';
if (!envBase) {
    if (typeof window !== 'undefined') {
        const { protocol, hostname } = window.location;
        // If we're on localhost (frontend dev server), use explicit backend port.
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            derived = 'http://localhost:4000';
        } else {
            // Assume same origin deployment (backend serves frontend)
            derived = '';
        }
    } else {
        // SSR / build time fallback
        derived = '';
    }
}

export const API_BASE = (envBase || derived).replace(/\/$/, '');
export const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
export const fileUrl = (filename) => `${API_BASE}/uploads/${filename}`;
// For viewer, sometimes we want to avoid cached responses
export const fileUrlNoCache = (filename) => `${API_BASE}/uploads/${filename}?v=${Date.now()}`;
