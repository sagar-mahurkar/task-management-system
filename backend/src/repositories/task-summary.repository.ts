import { AppDataSource } from "../database/dataSource";
import { Task } from "../entities/Task";

/** Database-level aggregation, scoped to the authenticated task owner. */
export type TaskSummaryCounts = {
  totalTasks: number | string;
  pending: number | string;
  inProgress: number | string;
  completed: number | string;
  low: number | string;
  medium: number | string;
  high: number | string;
};

export const TaskSummaryRepository = {
  async getCountsForUser(userId: string): Promise<TaskSummaryCounts> {
    const result = await AppDataSource.getRepository(Task)
      .createQueryBuilder("task")
      .select("COUNT(task.id)", "totalTasks")
      .addSelect("COUNT(task.id) FILTER (WHERE task.status = 'pending')", "pending")
      .addSelect("COUNT(task.id) FILTER (WHERE task.status = 'in_progress')", "inProgress")
      .addSelect("COUNT(task.id) FILTER (WHERE task.status = 'completed')", "completed")
      .addSelect("COUNT(task.id) FILTER (WHERE task.priority = 'low')", "low")
      .addSelect("COUNT(task.id) FILTER (WHERE task.priority = 'medium')", "medium")
      .addSelect("COUNT(task.id) FILTER (WHERE task.priority = 'high')", "high")
      .where("task.user_id = :userId", { userId })
      .getRawOne<TaskSummaryCounts>();

    // An aggregate COUNT query without GROUP BY returns one row even when empty.
    if (!result) {
      return { totalTasks: 0, pending: 0, inProgress: 0, completed: 0, low: 0, medium: 0, high: 0 };
    }
    return result;
  },
};
