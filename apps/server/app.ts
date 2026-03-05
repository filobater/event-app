import express, { type Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { AppError } from "utils/AppError.ts";
import authRoutes from "routes/auth.routes.ts";
import { API_ENDPOINTS } from "@events-app/endpoints";

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

app.use(API_ENDPOINTS.auth.base, authRoutes);

app.use((req: Request) => {
  throw new AppError(`the ${req.originalUrl} not found`, 404);
});

app.use(errorMiddleware);

export default app;
