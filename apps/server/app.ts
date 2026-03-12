import express, { type Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { AppError } from "utils/AppError.ts";
import authRoutes from "routes/auth.routes.ts";
import { API_ENDPOINTS } from "@events-app/endpoints";
import path from "path";

import { protect } from "middlewares/auth.middleware.ts";
import { restrictTo } from "middlewares/restrictTo.middleware.ts";
import usersRoutes from "routes/users.routes.ts";

const app = express();

app.use(morgan("dev"));

// Enable security headers while still allowing cross-origin images (uploads)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  // TODO: solve this later
  // protect,
  // restrictTo("admin"),
  express.static(path.join(__dirname, "uploads")),
);

app.use(API_ENDPOINTS.auth.base, authRoutes);
app.use(API_ENDPOINTS.users.base, usersRoutes);

app.use((req: Request) => {
  throw new AppError(`the ${req.originalUrl} not found`, 404);
});

app.use(errorMiddleware);

export default app;
