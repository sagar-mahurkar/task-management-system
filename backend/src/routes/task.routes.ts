import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validation.middleware";
import { createTaskSchema, listTasksQuerySchema, taskIdParamSchema, updateTaskSchema } from "../validators/task.validator";
import { z } from "zod";

const router = Router();
const validateQuery = (schema: z.ZodType): import("express").RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    next(result.error);
    return;
  }
  next();
};
const validateTaskId: import("express").RequestHandler = (req, _res, next) => {
  const result = taskIdParamSchema.safeParse(req.params);
  if (!result.success) {
    next(result.error);
    return;
  }
  next();
};

router.use(authenticate);
router.get("/", validateQuery(listTasksQuerySchema), listTasks);
router.post("/", validateBody(createTaskSchema), createTask);
router.get("/:id", validateTaskId, getTask);
router.patch("/:id", validateTaskId, validateBody(updateTaskSchema), updateTask);
router.delete("/:id", validateTaskId, deleteTask);

export default router;
