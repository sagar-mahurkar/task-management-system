// Paths are relative to VITE_API_URL, which should include /api/v1.
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  TASKS: {
    ROOT: '/tasks',
    BY_ID: (id: string) => `/tasks/${encodeURIComponent(id)}`,
  },
} as const;
