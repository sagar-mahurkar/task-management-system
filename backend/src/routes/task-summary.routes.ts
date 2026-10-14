import { Router } from "express";
import { getTaskSummary } from "../controllers/task-summary.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/", getTaskSummary);

export default router;
