import { Router } from "express";
import authRouter from "./auth.routes";
import taskRouter from "./task.routes";
import taskSummaryRouter from "./task-summary.routes";

const router = Router();

router.use("/auth", authRouter);
// Register the fixed summary path before /tasks/:id can match "summary".
router.use("/tasks/summary", taskSummaryRouter);
router.use("/tasks", taskRouter);

export default router;
