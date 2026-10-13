import { TaskRepository } from "../repositories/task.repository";
import { AppError } from "../utils/AppError";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "../validators/task.validator";

export const TaskService = {
  async list(userId: string, filters: ListTasksQuery) {
    return TaskRepository.findAllForUser(userId, filters);
  },

  async getById(userId: string, taskId: string) {
    const task = await TaskRepository.findByIdForUser(taskId, userId);
    if (!task) {
      throw new AppError(404, "TASK_NOT_FOUND", "Task not found.");
    }
    return task;
  },

  async create(userId: string, input: CreateTaskInput) {
    return TaskRepository.createForUser(userId, input);
  },

  async update(userId: string, taskId: string, input: UpdateTaskInput) {
    const task = await this.getById(userId, taskId);
    return TaskRepository.updateForUser(task, input);
  },

  async delete(userId: string, taskId: string): Promise<void> {
    const task = await this.getById(userId, taskId);
    await TaskRepository.deleteForUser(task);
  },
};
