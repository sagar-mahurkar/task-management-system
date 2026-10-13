# Task Management System — Database Design

## 1. Overview

- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Naming convention:** `snake_case` for database tables and columns; camelCase in TypeScript/JavaScript.
- **MVP entities:** `users`, `tasks`
- **Relationship:** One user has many tasks; each task belongs to one user.

## 2. Entity: `users`

| Column | Type | Constraints / behavior |
| --- | --- | --- |
| `id` | UUID | Primary key; generated UUID |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE |
| `password_hash` | VARCHAR(255) | NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL; defaults to current timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL; defaults to current timestamp and updates on modification |

Notes:

- Normalize email consistently before storage or comparison.
- Never store a plaintext password.
- Do not store a client-supplied role for this MVP; public registration does not need role assignment.

## 3. Entity: `tasks`

| Column | Type | Constraints / behavior |
| --- | --- | --- |
| `id` | UUID | Primary key; generated UUID |
| `user_id` | UUID | NOT NULL; foreign key to `users.id` |
| `title` | VARCHAR(200) | NOT NULL |
| `description` | TEXT | Nullable |
| `status` | VARCHAR(20) | NOT NULL; defaults to `pending` |
| `priority` | VARCHAR(10) | NOT NULL; defaults to `medium` |
| `due_date` | DATE | Nullable |
| `created_at` | TIMESTAMPTZ | NOT NULL; defaults to current timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL; defaults to current timestamp and updates on modification |

Allowed values:

- `status`: `pending`, `in_progress`, `completed`
- `priority`: `low`, `medium`, `high`

Status and priority are enforced using PostgreSQL `CHECK` constraints. Backend validation is also required.

## 4. Relationship and Delete Behavior

```text
users
-----
id (PK)
  |
  | 1-to-many
  v
tasks
-----
id (PK)
user_id (FK -> users.id, ON DELETE CASCADE)
```

- Each task belongs to exactly one user.
- A user can own zero or more tasks.
- Deleting a user automatically deletes that user's tasks through `ON DELETE CASCADE`.
- Task ownership must be derived from the authenticated user's identity in verified JWT context, never from a client-supplied `user_id`.

## 5. Constraints and Integrity

- `users.id`: primary key.
- `users.email`: unique and not null.
- `tasks.id`: primary key.
- `tasks.user_id`: foreign key and not null.
- `tasks.title`: not null; enforce non-empty trimmed input in application validation.
- `tasks.status`: restricted to `pending`, `in_progress`, or `completed`.
- `tasks.priority`: restricted to `low`, `medium`, or `high`.
- Passwords are represented only by `password_hash`.
- The database enforces status and priority constraints independently of backend validation.

## 6. Indexes

- Unique index on `users.email` for login and duplicate-registration checks.
- Index on `tasks.user_id` for retrieving a user's tasks.
- Composite index on `(user_id, status)` for user-scoped status filtering.
- Composite index on `(user_id, priority)` for user-scoped priority filtering.

Indexes should support expected query patterns rather than being added indiscriminately.

## 7. Query and Authorization Rules

- Every task list, detail, update, and delete operation must be scoped to the authenticated user.
- Filtering by status or priority must retain the user scope.
- Dashboard aggregation must count only tasks belonging to the authenticated user.
- If a task ID belongs to another user, do not disclose that task's data. Return a consistent not-found or forbidden response according to the API contract.

## 8. Schema Initialization and Migrations

Database provisioning, schema initialization, and seed data are separate operations.

### Local MVP initialization

The application startup sequence is:

1. Create the configured PostgreSQL database if it does not exist.
2. Initialize the TypeORM data source with all entities registered.
3. Inspect tables in the PostgreSQL `public` schema.
4. If the schema contains no tables, synchronize the registered entities to create the initial schema.
5. If both `users` and `tasks` already exist, skip synchronization.
6. If the schema is non-empty but either required application table is missing, fail startup and require manual inspection and a controlled migration.

This is a local MVP initialization shortcut, not a production migration strategy.

**Safety rules:**

- `synchronize` remains disabled in the TypeORM data source configuration.
- Automatic synchronization is invoked only for an empty `public` schema.
- Never run destructive schema synchronization automatically against an existing schema.
- Do not treat database provisioning, table creation, and seed data as interchangeable.
- Use reviewed TypeORM migrations for subsequent schema changes and production deployment.
- Use database credentials with only the privileges required by the environment.

### Timestamps

TypeORM's `CreateDateColumn` and `UpdateDateColumn` maintain the creation and modification timestamps through ORM operations. Direct SQL updates that bypass TypeORM do not automatically invoke ORM timestamp behavior.

## 9. Decisions Confirmed

- **User deletion:** cascade-delete dependent tasks.
- **Schema initialization:** local-only initial synchronization on an empty `public` schema; refuse automatic synchronization of a non-empty partial schema.
- **Status and priority:** use database `CHECK` constraints and backend validation.
- **Timestamps:** maintain through TypeORM date columns.
- **Migrations:** introduce reviewed migrations for controlled schema evolution.

The API contract will define the exact response for unauthorized task access.

## 10. Verification Checklist

- [ ] Both entities map to the documented table and column names.
- [ ] UUID primary keys and generated IDs are configured.
- [ ] `tasks.user_id` is non-null and references `users.id`.
- [ ] Deleting a user cascades to their tasks.
- [ ] Email uniqueness is enforced by the database.
- [ ] Status and priority values are constrained.
- [ ] User-scoped indexes exist.
- [ ] Creation and modification timestamps are configured.
- [ ] A clean database initializes the application schema.
- [ ] Existing schemas are not automatically synchronized.
- [ ] A partial application schema causes startup to fail safely.
- [ ] API tests verify that users cannot access one another's tasks.
