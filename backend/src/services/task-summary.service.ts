import { TaskSummaryRepository } from "../repositories/task-summary.repository";

export type TaskSummary = {
  totalTasks: number;
  byStatus: { pending: number; in_progress: number; completed: number };
  byPriority: { low: number; medium: number; high: number };
};

function asCount(value: number | string): number {
  const count = Number(value);
  return Number.isFinite(count) && count >= 0 ? count : 0;
}

export const TaskSummaryService = {
  async getForUser(userId: string): Promise<TaskSummary> {
    const counts = await TaskSummaryRepository.getCountsForUser(userId);
    return {
      totalTasks: asCount(counts.totalTasks),
      byStatus: {
        pending: asCount(counts.pending),
        in_progress: asCount(counts.inProgress),
        completed: asCount(counts.completed),
      },
      byPriority: {
        low: asCount(counts.low),
        medium: asCount(counts.medium),
        high: asCount(counts.high),
      },
    };
  },
};
