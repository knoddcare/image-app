import express, { NextFunction, Request, Response } from "express";
import { imageRouter } from "./routes/imageRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "./errors/AppError.js";

// Create app
export const app = express();

// Enable CORS for frontend
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

// Body parser - middleware that modifies incoming request data into json
app.use(express.json({ limit: "10kb" }));

// Serving static files
app.use(express.static("public"));

app.use("/images", imageRouter);

// ---- Error handling for routes

// 404 handler
app.use((req: Request, res: Response, _next: NextFunction) => {
  _next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, {
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  }));
});

// Global error handling middleware
app.use(errorHandler);
