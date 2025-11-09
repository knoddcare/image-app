import { NextFunction, Response, Request } from "express";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: AppError|Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      // TODO: log operational errors to a specific file or monitoring service
      console.error("Operational error:", err);
    }
    return res.status(err.statusCode).json(err.responseMessage || {
      status: "error",
      message: "Something went wrong",
    });
  }
  // Log the error details for debugging
  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}