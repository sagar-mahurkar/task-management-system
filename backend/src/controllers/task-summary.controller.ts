import type { Request, Response } from "express";
import { TaskSummaryService } from "../services/task-summary.service";

export async function getTaskSummary(req: Request, res: Response): Promise<void> {
  // The authenticate middleware guarantees this value before this controller runs.
  const summary = await TaskSummaryService.getForUser(req.auth!.userId);
  res.status(200).json({ data: summary });
}
