import express, { type Request, type Response } from "express";
import { type HealthResponseDto } from "@events-app/shared-dtos";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello, world!" });
});

app.get("/api/health", (req: Request, res: Response) => {
  const payload: HealthResponseDto = {
    status: "ok iam working",
    timestamp: new Date().toISOString(),
  };

  res.json(payload);
});

export default app;

