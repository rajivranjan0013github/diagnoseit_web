// In development (via Vite dev proxy) and in production (via Vercel rewrites),
// API requests use relative paths ('') so the request goes to /api on the same origin,
// avoiding browser CORS restrictions.
const rawApiUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE = (rawApiUrl && !rawApiUrl.includes('gtd.thebilling.in'))
    ? rawApiUrl
    : '';
