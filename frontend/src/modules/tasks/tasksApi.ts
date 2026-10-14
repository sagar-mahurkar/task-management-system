import { api } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from '@/shared/types/task';

export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
};

export const tasksApi = {
  async list(filters: TaskFilters = {}): Promise<Task[]> {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const response = await api.get<{ data: Task[] }>(API_ENDPOINTS.TASKS.ROOT, { params });
    return response.data.data;
  },
  async getById(id: string): Promise<Task> {
    const response = await api.get<{ data: Task }>(API_ENDPOINTS.TASKS.BY_ID(id));
    return response.data.data;
  },
  async create(input: CreateTaskInput): Promise<Task> {
    const response = await api.post<{ data: Task }>(API_ENDPOINTS.TASKS.ROOT, input);
    return response.data.data;
  },
  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await api.patch<{ data: Task }>(API_ENDPOINTS.TASKS.BY_ID(id), input);
    return response.data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
  },
};
