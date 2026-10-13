import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "./routes";
import { AppError } from "./utils/AppError";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1", apiRouter);

app.use((_req, _res, next) => {
  next(new AppError(404, "NOT_FOUND", "Resource not found."));
});

app.use(errorMiddleware);

export default app;
