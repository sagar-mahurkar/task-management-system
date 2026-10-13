import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  const result = await AuthService.register(req.body);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await AuthService.login(req.body);
  res.status(200).json(result);
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const user = await AuthService.getCurrentUser(req.auth!.userId);
  res.status(200).json({ user });
}
