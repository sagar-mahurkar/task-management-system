# Task Management System

A full-stack MVP for managing personal tasks, including task status, priority, optional due dates, filtering, and a personal dashboard.

## Features

- User registration and login using JWT authentication
- Protected API endpoints
- Create, list, view, update, and delete personal tasks
- Task status: `pending`, `in_progress`, `completed`
- Task priority: `low`, `medium`, `high`
- Optional due dates
- Filtering by status and priority
- Dashboard counts by status and priority
- Backend validation and ownership-based authorization
- PostgreSQL persistence

## Technology Stack

### Backend
- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- Zod
- JWT
- bcrypt
- Jest and Supertest

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Bootstrap

## Repository Structure

```text
.
├── backend/                 # Express REST API
├── frontend/                # React application
├── docs/
│   ├── requirements.md      # MVP scope and requirements
│   ├── database-design.md   # PostgreSQL entities and constraints
│   └── api-design.md        # REST API contract
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- PostgreSQL
- Git

Use compatible versions for the dependencies declared in `backend/package.json` and `frontend/package.json`.

## Configuration

### Backend

From the repository root:

```bash
cd backend
cp .env.example .env
```

Configure the variables in `backend/.env`:

| Variable | Purpose | Example |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | Backend HTTP port | `3000` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_NAME` | Application database name | `task_management` |
| `DATABASE_USER` | PostgreSQL user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | Set locally |
| `JWT_SECRET_KEY` | Secret used to sign JWTs | Set a strong local secret |
| `FRONTEND_ORIGIN` | Allowed frontend origin for CORS | `http://localhost:5173` |

Do not commit `.env` or put real credentials in `.env.example`.

The backend startup code provisions the configured database if it does not exist. For the local MVP, the initial schema is synchronized only when the PostgreSQL `public` schema is empty. A non-empty partial schema causes startup to fail rather than being synchronized automatically. This behavior is not a production migration strategy; see `docs/database-design.md`.

### Frontend

From the repository root:

```bash
cd frontend
cp .env.example .env
```

Configure:

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |
| `VITE_API_TIMEOUT` | Axios request timeout in milliseconds | `10000` |

Only non-secret configuration belongs in frontend environment variables. Vite variables are exposed to browser code.

## Run Locally

Use two terminals from the repository root.

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

The default backend port is `3000`. The health endpoint is:

```text
GET http://localhost:3000/health
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. Open that URL in a browser.

Make sure PostgreSQL is running and the backend `.env` values are correct before starting the backend.

## API Overview

The API base path is `/api/v1`. Protected endpoints require:

```http
Authorization: Bearer <access-token>
```

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Log in |
| `GET` | `/auth/me` | Get the authenticated user's profile |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks` | List tasks; supports status and priority filters |
| `GET` | `/tasks/:id` | Get one owned task |
| `PATCH` | `/tasks/:id` | Update an owned task |
| `DELETE` | `/tasks/:id` | Delete an owned task |
| `GET` | `/tasks/summary` | Get personal task counts |

See [`docs/api-design.md`](docs/api-design.md) for request/response formats, validation rules, and error codes.

## Development Checks

### Backend

```bash
cd backend
npm test -- --runInBand
npm run typecheck
npm run build
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

The API test suite uses Jest and Supertest. Run these commands from their respective directories. Tests that require a database must use the test configuration expected by the existing test suite.

## Documentation

- [Requirements and MVP scope](docs/requirements.md)
- [Database design](docs/database-design.md)
- [API design](docs/api-design.md)
- [Frontend development instructions](frontend/README.md)

## Scope

This is an MVP for personal task management. Team collaboration, task assignment, notifications, recurring tasks, attachments, real-time updates, advanced analytics, and production deployment are outside the current scope.
