import { z } from "zod";

const taskStatusSchema = z.enum(["pending", "in_progress", "completed"]);
const taskPrioritySchema = z.enum(["low", "medium", "high"]);
const dueDateSchema = z.string().date("Due date must use YYYY-MM-DD format.");

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  description: z.string().nullable().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: dueDateSchema.nullable().optional(),
}).strict();

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty.").max(200).optional(),
  description: z.string().nullable().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: dueDateSchema.nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be provided.",
});

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
}).strict();

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Task ID must be a valid UUID."),
}).strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
