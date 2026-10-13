import type { FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../database/dataSource";
import { Task } from "../entities/Task";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "../validators/task.validator";

export const TaskRepository = {
  async findAllForUser(userId: string, filters: ListTasksQuery): Promise<Task[]> {
    const where: FindOptionsWhere<Task> = {
      user: { id: userId },
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
    };

    return AppDataSource.getRepository(Task).find({
      where,
      order: { createdAt: "DESC" },
    });
  },

  async findByIdForUser(taskId: string, userId: string): Promise<Task | null> {
    return AppDataSource.getRepository(Task).findOne({
      where: { id: taskId, user: { id: userId } },
    });
  },

  async createForUser(userId: string, input: CreateTaskInput): Promise<Task> {
    const repository = AppDataSource.getRepository(Task);
    const task = repository.create({
      ...input,
      status: input.status ?? "pending",
      priority: input.priority ?? "medium",
      dueDate: input.dueDate ?? null,
      description: input.description ?? null,
      user: { id: userId },
    });
    return repository.save(task);
  },

  async updateForUser(task: Task, input: UpdateTaskInput): Promise<Task> {
    const repository = AppDataSource.getRepository(Task);
    repository.merge(task, input);
    return repository.save(task);
  },

  async deleteForUser(task: Task): Promise<void> {
    await AppDataSource.getRepository(Task).remove(task);
  },
};
