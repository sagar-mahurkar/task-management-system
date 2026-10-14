const rawApiUrl = import.meta.env.VITE_API_URL;
const rawTimeout = import.meta.env.VITE_API_TIMEOUT;

if (!rawApiUrl?.trim()) {
  throw new Error('VITE_API_URL is missing or empty. Copy .env.example to .env and configure it.');
}

let apiUrl: URL;
try {
  apiUrl = new URL(rawApiUrl.trim());
} catch {
  throw new Error('VITE_API_URL must be an absolute HTTP(S) URL.');
}

if (apiUrl.protocol !== 'http:' && apiUrl.protocol !== 'https:') {
  throw new Error('VITE_API_URL must use HTTP or HTTPS.');
}

const apiTimeout = Number(rawTimeout);
if (!rawTimeout?.trim() || !Number.isFinite(apiTimeout) || apiTimeout <= 0) {
  throw new Error('VITE_API_TIMEOUT must be a positive number of milliseconds.');
}

export const env = {
  API_URL: apiUrl.toString().replace(/\/$/, ''),
  API_TIMEOUT: apiTimeout,
} as const;
