import { api } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { TaskSummary } from '@/shared/types/taskSummary';

export const dashboardApi = {
  async getSummary(): Promise<TaskSummary> {
    const response = await api.get<{ data: TaskSummary }>(API_ENDPOINTS.TASKS.SUMMARY);
    return response.data.data;
  },
};
