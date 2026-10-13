import { Router } from "express";
import authRouter from "./auth.routes";
import taskRouter from "./task.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/tasks", taskRouter);

export default router;
