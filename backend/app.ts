import express, { NextFunction, Request, Response } from "express";
import imageRouter from "./routes/imageRoutes";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

app.use(express.json({ limit: "10kb" }));

app.use(express.static("public"));

app.use("/images", imageRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

interface CustomError extends Error {
  status?: number;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;
