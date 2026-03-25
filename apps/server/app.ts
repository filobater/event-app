import express, { type Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { AppError } from "utils/AppError.ts";
import authRoutes from "routes/auth.routes.ts";
import { API_ENDPOINTS } from "@events-app/endpoints";
import path from "path";

import usersRoutes from "routes/users.routes.ts";
import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from "url";
import eventsRoutes from "routes/events.routes.ts";
import { updateEventStatus } from "process/updateEventStatus.ts";
import { updateRegistrationPaymentStatus } from "process/updateRegistrationPaymentStatus.ts";
import registrationsRoutes from "routes/registrations.routes.ts";
import dashboardRoutes from "routes/dashboard.routes.ts";
import { protectUploads } from "middlewares/protectUploads.middleware.ts";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// process -------------
updateEventStatus();
updateRegistrationPaymentStatus();
// -----------------------------

const app = express();

app.use(morgan("dev"));

// app.use(limiter);

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
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  protectUploads,
  express.static(path.join(__dirname, "uploads")),
);

app.use(API_ENDPOINTS.auth.base, authRoutes);
app.use(API_ENDPOINTS.users.base, usersRoutes);
app.use(API_ENDPOINTS.events.base, eventsRoutes);
app.use(API_ENDPOINTS.registrations.base, registrationsRoutes);
app.use(API_ENDPOINTS.admin.dashboard.base, dashboardRoutes);

app.use((req: Request) => {
  throw new AppError(`the ${req.originalUrl} not found`, 404);
});

app.use(errorMiddleware);

export default app;
