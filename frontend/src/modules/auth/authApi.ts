import { api } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { AuthResponse, User } from '@/shared/types/user';

export type RegisterInput = { name: string; email: string; password: string };
export type LoginInput = { email: string; password: string };

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, input);
    return response.data;
  },
  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, input);
    return response.data;
  },
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return response.data.user;
  },
};
