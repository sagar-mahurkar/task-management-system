import axios from 'axios';
import { env } from '@/config/env';
import { STORAGE_KEYS } from '@/shared/constants/storage';

export const api = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      // Invalid credentials during login are not evidence of an expired session.
      const isPublicAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isPublicAuthRequest && localStorage.getItem(STORAGE_KEYS.TOKEN)) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  },
);
