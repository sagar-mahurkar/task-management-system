# Task Management System --- Requirements

## 1. Project Classification

- **Classification:** Small MVP
- **Stack:** Node.js, Express, TypeScript, React, PostgreSQL
- **Target implementation time:** 6 hours maximum
- **Primary goal:** Deliver a working application for users to manage
    their personal tasks.

The time limit is a target, not a guarantee. Prioritize a complete core
workflow over optional features and visual polish.

## 2. Problem Statement

Users need a simple application to create, organize, prioritize, and
track their own tasks and deadlines.

## 3. Users

Registered users. Each user manages only their own tasks.

## 4. Functional Requirements

### FR-01: Registration

- A user can register with a name, email, and password.
- Email addresses must be unique.
- Passwords must be hashed before storage.
- Public registration must not grant privileged roles.

### FR-02: Login

- A registered user can log in using email and password.
- Successful login returns a JWT access token.
- Protected API endpoints require a valid token.

### FR-03: Task creation

- An authenticated user can create a task.
- A task has a title, optional description, status, priority, and
    optional due date.
- New tasks default to `pending` status and `medium` priority unless
    the user selects otherwise.

### FR-04: Task listing and details

- A user can list their own tasks and view an individual task.
- A user must not be able to access another user's tasks.

### FR-05: Task updates

- A user can update their own task's title, description, status,
    priority, and due date.
- Status must be one of `pending`, `in_progress`, or `completed`.
- Priority must be one of `low`, `medium`, or `high`.

### FR-06: Task deletion

- A user can delete their own task.
- A user cannot delete another user's task.

### FR-07: Filtering

- A user can filter their task list by status and priority.
- Filtering must be applied by the backend and restricted to the
    authenticated user.

### FR-08: Personal dashboard

- A user can view task counts for their own tasks, including total,
    pending, in-progress, and completed tasks.
- Dashboard values must reflect persisted task data.

## 5. Non-Functional Requirements

- Validate request data on the backend.
- Hash passwords using an established password-hashing library.
- Keep JWT secrets and database credentials in environment variables.
- Enforce ownership authorization on the backend, not only in React.
- Use consistent HTTP status codes and error responses.
- Keep the implementation small enough for the MVP time box.
- Provide automated API tests using Jest and Supertest.
- Do not commit `.env` files or real secrets.

## 6. MVP Scope

Included: - Registration and login - JWT-protected API - Task CRUD -
Status and priority - Optional due dates - Status and priority
filtering - Personal dashboard counts - Ownership-based authorization -
Essential automated API tests - Setup and usage documentation

## 7. Out of Scope

- Assigning tasks to other users or team collaboration
- Email notifications and reminders
- Recurring tasks
- Comments, attachments, and file uploads
- Real-time updates
- Redis, background workers, and microservices
- Advanced analytics
- Production deployment, unless all core requirements are complete
    early
- Elaborate UI design or animation

## 8. Acceptance Criteria

The acceptance criteria below remain the specification checklist. Manual E2E scenarios and automated checks were reported as passing during Phase 13; this status does not replace the detailed criteria or their automated tests.

- [ ] A user can register and log in.
- [ ] Passwords are not stored in plaintext.
- [ ] Protected endpoints reject missing or invalid authentication.
- [ ] An authenticated user can create, view, update, and delete their
    own tasks.
- [ ] Status and priority accept only documented values.
- [ ] Status and priority filters return correct results.
- [ ] Due dates can be created, viewed, and updated.
- [ ] Dashboard counts are correct for the authenticated user.
- [ ] Cross-user access to tasks is prevented and tested.
- [ ] Relevant Jest/Supertest API tests pass.
- [ ] Frontend and backend run together successfully.
- [ ] README and `.env.example` document local setup without real
    secrets.

## 9. Delivery Rule

Build and verify the core user journey first: register → log in → create
task → list/filter tasks → update task → delete task. Defer out-of-scope
features rather than expanding the MVP during implementation.
