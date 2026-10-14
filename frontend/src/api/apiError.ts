import axios from 'axios';

type ApiErrorResponse = {
  error?: { message?: string; details?: unknown };
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response;
    if (response?.data?.error?.message) return response.data.error.message;
    if (response?.data?.message) return response.data.message;
    if (!response) return 'Unable to reach the server. Check that the backend is running and the API URL is correct.';
  }
  return fallback;
}
