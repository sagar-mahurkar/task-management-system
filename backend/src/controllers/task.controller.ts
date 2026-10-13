import type { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import type { ListTasksQuery } from "../validators/task.validator";

function authenticatedUserId(req: Request): string {
  // The authenticate middleware guarantees this value before this controller runs.
  return req.auth!.userId;
}

export async function listTasks(req: Request, res: Response): Promise<void> {
  const filters = req.query as unknown as ListTasksQuery;
  const tasks = await TaskService.list(authenticatedUserId(req), filters);
  res.status(200).json({ data: tasks });
}

export async function getTask(req: Request, res: Response): Promise<void> {
  const task = await TaskService.getById(authenticatedUserId(req), req.params.id as string);
  res.status(200).json({ data: task });
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const task = await TaskService.create(authenticatedUserId(req), req.body);
  res.status(201).json({ data: task });
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const task = await TaskService.update(
    authenticatedUserId(req),
    req.params.id as string,
    req.body,
  );
  res.status(200).json({ data: task });
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  await TaskService.delete(authenticatedUserId(req), req.params.id as string);
  res.status(204).send();
}
