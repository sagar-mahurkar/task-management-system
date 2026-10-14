export interface TaskSummary {
  totalTasks: number;
  byStatus: { pending: number; in_progress: number; completed: number };
  byPriority: { low: number; medium: number; high: number };
}
