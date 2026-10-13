import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Password must contain at least 8 characters.").max(72, "Password must not exceed 72 characters."),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1, "Password is required.").max(72),
}).strict();
