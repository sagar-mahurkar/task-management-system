# Task Management System — Frontend

React and TypeScript frontend for the Task Management System. The app uses Vite for local development and production builds.

## Prerequisites

- Node.js and npm
- The Task Management System backend running locally
- Backend configuration and PostgreSQL set up as described in the root [`README.md`](../README.md)

## Setup

From the repository root:

```bash
cd frontend
npm install
cp .env.example .env
```

Set the frontend environment variables in `.env`:

```dotenv
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=10000
```

- `VITE_API_URL` is the backend API base URL.
- `VITE_API_TIMEOUT` is the Axios timeout in milliseconds.

Vite exposes `VITE_*` values to browser code. Do not put secrets in frontend environment variables.

## Run the Development Server

```bash
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). Ensure the backend is running and its `FRONTEND_ORIGIN` setting allows the frontend origin.

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Type-check with TypeScript and create the production build |
| `npm run preview` | Preview the built frontend locally |

## Application Integration

The frontend communicates with the backend through the configured API base URL. Authenticated requests use the stored access token. The API contract, endpoint list, response shapes, and error codes are documented in [`../docs/api-design.md`](../docs/api-design.md).

## Verification

Run from the `frontend/` directory:

```bash
npm run lint
npm run build
```

## Related Documentation

- [Root project README](../README.md)
- [MVP requirements](../docs/requirements.md)
- [API design](../docs/api-design.md)
