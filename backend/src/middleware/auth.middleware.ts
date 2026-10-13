import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.header("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new AppError(401, "AUTHENTICATION_REQUIRED", "A bearer access token is required."));
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) {
    next(new AppError(401, "INVALID_TOKEN", "The access token is invalid or expired."));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.userId };
    next();
  } catch {
    next(new AppError(401, "INVALID_TOKEN", "The access token is invalid or expired."));
  }
}
