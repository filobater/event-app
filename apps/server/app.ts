import express, { type Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { AppError } from "utils/AppError.ts";
import authRoutes from "routes/auth.routes.ts";
import { API_ENDPOINTS } from "@events-app/endpoints";
import path from "path";
import { protect, restrictTo } from "controllers/auth.controller.ts";
import usersRoutes from "routes/users.routes.ts";

const app = express();

app.use(morgan("dev"));

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

// app.use(
//   "/uploads",
//   protect,
//   restrictTo("admin"),
//   express.static(path.join(__dirname, "uploads")),
// );

app.use(API_ENDPOINTS.auth.base, authRoutes);
app.use(API_ENDPOINTS.users.base, usersRoutes);

app.use((req: Request) => {
  throw new AppError(`the ${req.originalUrl} not found`, 404);
});

app.use(errorMiddleware);

export default app;
