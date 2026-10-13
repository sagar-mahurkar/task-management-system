# Task Management System --- Database Design

## 1. Overview

- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Naming convention:** `snake_case` for database tables and columns;
    camelCase in TypeScript/JavaScript.
- **MVP entities:** `users`, `tasks`
- **Relationship:** One user has many tasks; each task belongs to one
    user.

## 2. Entity: `users`

| Column          | Suggested type | Constraints / behavior                                      |
|-----------------|----------------|-------------------------------------------------------------|
| `id`            | UUID           | Primary key; generated UUID                                 |
| `name`          | VARCHAR(100)   | NOT NULL                                                    |
| `email`         | VARCHAR(255)   | NOT NULL, UNIQUE                                            |
| `password_hash` | VARCHAR(255)   | NOT NULL                                                    |
| `created_at`    | TIMESTAMPTZ    | NOT NULL; default current timestamp                         |
| `updated_at`    | TIMESTAMPTZ    | NOT NULL; default current timestamp; update on modification |

Notes: - Normalize email consistently before storage or comparison. -
Never store a plaintext password. - Do not store a client-supplied role
for this MVP; public registration does not need role assignment.

## 3. Entity: `tasks`

| Column       | Suggested type | Constraints / behavior                                      |
|--------------|----------------|-------------------------------------------------------------|
| `id`         | UUID           | Primary key; generated UUID                                 |
| `user_id`    | UUID           | NOT NULL; foreign key to `users.id`                         |
| `title`      | VARCHAR(200)   | NOT NULL                                                    |
| `description`| TEXT           | Nullable                                                    |
| `status`     | VARCHAR(20)    | NOT NULL; default `pending`; allowed values defined below   |
| `priority`   | VARCHAR(10)    | NOT NULL; default `medium`; allowed values defined below    |
| `due_date`   | DATE           | Nullable                                                    |
| `created_at` | TIMESTAMPTZ    | NOT NULL; default current timestamp                         |
| `updated_at` | TIMESTAMPTZ    | NOT NULL; default current timestamp; update on modification |

Allowed values: - `status`: `pending`, `in_progress`, `completed` -
`priority`: `low`, `medium`, `high`

Enforce allowed values with PostgreSQL `CHECK` constraints or an
equivalent database-enforced design. Backend validation is also
required.

## 4. Relationship

``` text
users
-----
id (PK)
  |
  | 1-to-many
  v
tasks
-----
id (PK)
user_id (FK -> users.id)
```

- Each task belongs to exactly one user.
- A user can own zero or more tasks.
- Consider `ON DELETE CASCADE` for `tasks.user_id` so deleting a user
    removes their dependent tasks. Confirm this behavior before
    implementation.
- Ownership checks must use the authenticated user's identity from
    verified JWT context, never a `user_id` supplied by the client.

## 5. Constraints and Integrity

- `users.id`: primary key.
- `users.email`: unique and not null.
- `tasks.id`: primary key.
- `tasks.user_id`: foreign key and not null.
- `tasks.title`: not null; enforce non-empty trimmed input in
    application validation.
- `tasks.status`: restricted to the three documented values.
- `tasks.priority`: restricted to the three documented values.
- Passwords are represented only by `password_hash`.

## 6. Indexes

Start with indexes justified by expected queries:

- Unique index on `users.email` for login and duplicate-registration
    checks.
- Index on `tasks.user_id` for retrieving a user's tasks.
- Consider a composite index on `(user_id, status)` for user-scoped
    status filtering.
- Consider a composite index on `(user_id, priority)` for user-scoped
    priority filtering.

Do not add indexes to every column. Reassess indexes if query patterns
change.

## 7. Query and Authorization Rules

- Every task list, detail, update, and delete operation must be scoped
    to the authenticated user.
- Filtering by status or priority must retain the user scope.
- Dashboard aggregation must count only tasks belonging to the
    authenticated user.
- If a task ID belongs to another user, do not disclose that task's
    data. Return a consistent not-found or forbidden response according
    to the API contract.

## 8. Migration and Initialization

- Define the schema through TypeORM entities and a controlled
    schema/migration workflow.
- For a short local MVP, choose one explicit schema initialization
    approach and document it.
- Do not run destructive schema synchronization against an existing
    database.
- Keep database provisioning, schema creation/migrations, and seed
    data conceptually separate.

## 9. Decisions to Confirm During Implementation

- Whether deleting a user cascades to their tasks; proposed behavior
    is cascade.
- Exact API response envelope and whether unauthorized task access
    returns `404` or `403`.
- Whether `updated_at` is maintained by application code or a database
    mechanism.
- Whether the MVP uses TypeORM migrations immediately or a clearly
    documented local-only initialization shortcut.

## 10. Verification Checklist

- [ ] Both entities map to the documented table and column names.
- [ ] Primary and foreign keys are configured.
- [ ] Email uniqueness is enforced by the database.
- [ ] Status and priority values are constrained.
- [ ] User-scoped query patterns have appropriate indexes.
- [ ] Two different users cannot access one another's tasks through
    the API.
- [ ] Schema setup can be reproduced from the documented instructions.
