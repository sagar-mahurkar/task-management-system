# API Design — Task Management System

## Conventions

- Base path: `/api/v1`; request and response bodies use JSON.
- Protected endpoints require `Authorization: Bearer <access-token>`.
- Access tokens use HS256 and expire after one hour.
- Passwords are hashed with bcrypt and never returned.
- Email addresses are trimmed and normalized to lowercase.
- Success responses for task endpoints use `{ "data": ... }`; delete returns `204 No Content`.
- Errors use `{ "error": { "code": "...", "message": "..." } }`. Validation errors may include `details`.
- Task ownership is derived exclusively from the verified token. Clients must not send `user_id`.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | Health check. |
| POST | `/api/v1/auth/register` | No | Register and return a token. |
| POST | `/api/v1/auth/login` | No | Authenticate and return a token. |
| GET | `/api/v1/auth/me` | Bearer token | Return the authenticated user's public profile. |
| POST | `/api/v1/tasks` | Bearer token | Create a task owned by the authenticated user. |
| GET | `/api/v1/tasks` | Bearer token | List the authenticated user's tasks; optionally filter by status and priority. |
| GET | `/api/v1/tasks/:id` | Bearer token | Retrieve one of the authenticated user's tasks. |
| PATCH | `/api/v1/tasks/:id` | Bearer token | Update one of the authenticated user's tasks. |
| DELETE | `/api/v1/tasks/:id` | Bearer token | Delete one of the authenticated user's tasks. |

## Task model

Task fields returned by the API: `id`, `title`, `description`, `status`, `priority`, `dueDate`, `createdAt`, and `updatedAt`. `user_id` is not accepted from clients. New tasks default to `status: "pending"` and `priority: "medium"`; `description` and `dueDate` default to `null`.

Allowed values:

- `status`: `pending`, `in_progress`, `completed`
- `priority`: `low`, `medium`, `high`
- `dueDate`: optional `YYYY-MM-DD` date or `null`

## Create task

`POST /api/v1/tasks`

Request:

```json
{
  "title": "Prepare interview notes",
  "description": "Review API design",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-20"
}
```

`title` is required, trimmed, and 1–200 characters. `description` is optional or null. `status` and `priority` are optional and must use the documented values. `dueDate` is optional and must be `YYYY-MM-DD` or null. Unknown fields are rejected.

Success: `201 Created`, `{ "data": { ...task } }`.

Errors: `400 VALIDATION_ERROR`, `401 AUTHENTICATION_REQUIRED` or `401 INVALID_TOKEN`, `500 INTERNAL_SERVER_ERROR`.

## List tasks

`GET /api/v1/tasks?status=pending&priority=high`

Optional query parameters: `status` and `priority`, with the allowed values above. Both filters can be combined. All filters are applied by the backend within the authenticated user's scope. Unknown query parameters and invalid values are rejected.

Success: `200 OK`, `{ "data": [ ...tasks ] }`, newest-created first.

Errors: `400 VALIDATION_ERROR`, `401 AUTHENTICATION_REQUIRED` or `401 INVALID_TOKEN`, `500 INTERNAL_SERVER_ERROR`.

## Get task

`GET /api/v1/tasks/:id`

`id` must be a UUID. Success: `200 OK`, `{ "data": { ...task } }`.

Errors: `400 VALIDATION_ERROR` for malformed IDs, `401` for authentication failures, `404 TASK_NOT_FOUND` when the task does not exist or is not owned by the authenticated user, `500 INTERNAL_SERVER_ERROR`.

## Update task

`PATCH /api/v1/tasks/:id`

Accepts one or more of `title`, `description`, `status`, `priority`, and `dueDate`; at least one field is required. Validation rules match task creation. Unknown fields are rejected. Success: `200 OK`, `{ "data": { ...task } }`.

Errors: `400 VALIDATION_ERROR`, `401` for authentication failures, `404 TASK_NOT_FOUND` for absent or non-owned tasks, `500 INTERNAL_SERVER_ERROR`.

## Delete task

`DELETE /api/v1/tasks/:id`

Success: `204 No Content`.

Errors: `400 VALIDATION_ERROR`, `401` for authentication failures, `404 TASK_NOT_FOUND` for absent or non-owned tasks, `500 INTERNAL_SERVER_ERROR`.

## Authentication endpoints

### Register — `POST /api/v1/auth/register`

Request: `{ "name": "Sagar", "email": "sagar@example.com", "password": "a-password-with-8-or-more-characters" }`.

Success: `201 Created`, `{ "user": { "id": "uuid", "name": "Sagar", "email": "sagar@example.com", "createdAt": "timestamp" }, "accessToken": "jwt" }`.

Errors: `400 VALIDATION_ERROR`, `409 EMAIL_ALREADY_REGISTERED`, `500 INTERNAL_SERVER_ERROR`.

### Login — `POST /api/v1/auth/login`

Request: `{ "email": "sagar@example.com", "password": "a-password-with-8-or-more-characters" }`.

Success: `200 OK`, same response shape as registration. Errors: `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS`, `500 INTERNAL_SERVER_ERROR`.

### Current user — `GET /api/v1/auth/me`

Success: `200 OK`, `{ "user": { "id": "uuid", "name": "Sagar", "email": "sagar@example.com", "createdAt": "timestamp" } }`.

Errors: `401 AUTHENTICATION_REQUIRED`, `401 INVALID_TOKEN`, `500 INTERNAL_SERVER_ERROR`.

## Common error codes

| Status | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request body, query, or path parameter failed validation. |
| 400 | `INVALID_JSON` | Malformed JSON request body. |
| 401 | `AUTHENTICATION_REQUIRED` | Bearer token is missing. |
| 401 | `INVALID_TOKEN` | Token is invalid, expired, or references a deleted user. |
| 401 | `INVALID_CREDENTIALS` | Email/password combination is incorrect. |
| 404 | `NOT_FOUND` | Route does not exist. |
| 404 | `TASK_NOT_FOUND` | Task does not exist or is not owned by the caller. |
| 409 | `EMAIL_ALREADY_REGISTERED` | Email address is already registered. |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error. |

## Authorization boundary

Every list, detail, update, and delete operation is scoped by the authenticated user ID from verified JWT context. A task owned by another user is treated as not found; the API does not disclose its data. Dashboard aggregation is a separate Phase 8 feature.
