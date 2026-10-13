import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "./AppError";

const ACCESS_TOKEN_TTL = "1h";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY must be configured.");
  }
  return secret;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: "HS256",
    subject: userId,
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function verifyAccessToken(token: string): { userId: string } {
  try {
    const payload = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
    if (typeof payload === "string" || typeof (payload as JwtPayload).sub !== "string") {
      throw new Error("Missing subject claim.");
    }
    return { userId: (payload as JwtPayload).sub as string };
  } catch {
    throw new AppError(401, "INVALID_TOKEN", "The access token is invalid or expired.");
  }
}
