# Eventify — Events App

A full-stack web application for discovering events, registering with seat selection, and managing users and events. The UI is an Angular 21 app, styled with Tailwind CSS and DaisyUI; the API is an Express server backed by MongoDB, with shared TypeScript packages for API contracts and DTOs.

## Demo



If you want to see the pages without running the project → open **[Pages Design](Pages%20Design/)** (static layouts / design references in that folder).

## Features

- **Authentication** — Sign up, sign in, forgot password, reset password, and OTP verification; JWT access tokens and HTTP-only refresh cookies.
- **Events** — Browse events and open event details; register for events with seat-based confirmation flows.
- **Profile** — Account information, password change, and a list of your registrations.
- **Admin (role-protected)** — Dashboard with analytics-style charts, user management (including per-user registrations), and event management.
- **Backend** — REST API with rate limiting hooks, Helmet, CORS, XSS sanitization, file uploads (protected static serving), scheduled jobs for event and payment status updates, and email support (Nodemailer) where configured.

## File structure

```
events-app/
├── apps/
│   ├── client/                          # Angular frontend
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/                # App-wide: guards, facades, interceptors, services,
│   │   │   │   │                        #   request-state, toast
│   │   │   │   ├── features/            # admin, auth, events, profile, not-found (routes, pages,
│   │   │   │   │                        #   feature components, facades/services where used)
│   │   │   │   ├── layouts/             # main + auth shells
│   │   │   │   └── shared/
│   │   │   │       ├── components/      # Reusable UI (inputs, modals, navbar, pagination, …)
│   │   │   │       ├── constants/       # Navigation paths, route segments (e.g. navigation.ts)
│   │   │   │       └── utils/           # Shared helpers (pagination, resources, …)
│   │   │   ├── environments/
│   │   │   └── styles.css
│   │   └── angular.json
│   └── server/                          # Express API
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       │   └── upload/                  # Multer / upload-related middleware
│       ├── models/
│       ├── process/                     # Cron / scheduled jobs (event & payment status, …)
│       ├── routes/
│       ├── schemas/                     # Zod validation (auth, user, registration, …)
│       │   └── event/                   # Event-specific refine rules
│       ├── services/
│       ├── types/
│       ├── utils/                       # e.g. tokens, email helpers, AppError
│       ├── uploads/                     # Runtime user uploads (events, profile pictures, speakers)
│       ├── app.ts
│       └── server.ts
├── packages/
│   ├── endpoints/                       # @events-app/endpoints — shared API path constants (`src/`)
│   └── shared-dtos/                     # @events-app/shared-dtos — shared DTOs (`src/`)
├── package.json                         # Root workspaces + dev script
└── package-lock.json
```

## How to run

### Prerequisites

- **Node.js** (LTS recommended) and **npm** (workspaces use `npm@10.x`).
- **MongoDB** — a running instance and a connection string.

### 1. Install dependencies

From the repository root:

```bash
npm install
```

### 2. Configure the server

Create `apps/server/.env` (the dev script loads it via `tsx`). Typical variables include:

| Variable                       | Purpose                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| `DB_URI`                       | MongoDB connection string                                               |
| `PORT`                         | API port (default `5000` if omitted)                                    |
| `FRONTEND_URL`                 | Origin allowed by CORS (e.g. `http://localhost:4200`)                   |
| `JWT_SECRET`                   | Secret for access tokens                                                |
| `JWT_REFRESH_SECRET`           | Secret for refresh tokens                                               |
| `JWT_EXPIRES_IN`               | Access token lifetime (e.g. `15m`)                                      |
| `JWT_REFRESH_EXPIRES_IN`       | Refresh lifetime in **days** (number, used for cookies and refresh JWT) |
| `EMAIL_USER`, `EMAIL_PASSWORD` | Email provider credentials (for password reset / notifications)         |

Adjust `apps/client/src/environments/environment.ts` if your API is not at `http://localhost:5000`.

### 3. Start client and server together

From the repository root:

```bash
npm run dev
```

This runs the Angular dev server and the API concurrently (`dev:client` + `dev:server`).

- **Client:** usually `http://localhost:4200`
- **API:** `http://localhost:<PORT>` (default `5000`)

### Individual workspaces

```bash
npm run dev:client    # Angular only
npm run dev:server    # API only (from root; uses nodemon + tsx)
```

Build the API for production: `npm run build -w event-app-server`, then `npm run start -w event-app-server`. Build the client: `npm run build -w client`.
