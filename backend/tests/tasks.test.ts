import { randomUUID } from "node:crypto";
import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/database/dataSource";
import { Task } from "../src/entities/Task";
import { User } from "../src/entities/User";

/**
 * These tests exercise the HTTP routes, validation, JWT authentication,
 * controllers, services, and repository query scoping together. TypeORM's
 * repository is replaced with an in-memory implementation, so PostgreSQL
 * itself is not exercised by this suite.
 */
jest.mock("../src/database/dataSource", () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

type TestUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

type TestTask = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: { id: string };
};

const users: TestUser[] = [];
const tasks: TestTask[] = [];

const userRepository = {
  findOneBy: jest.fn(async (where: Partial<TestUser>) =>
    users.find((user) => Object.entries(where).every(([key, value]) =>
      user[key as keyof TestUser] === value,
    )) ?? null,
  ),
  create: jest.fn((values: Partial<TestUser>) => ({
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...values,
  })),
  save: jest.fn(async (user: Partial<TestUser>) => {
    const saved = {
      id: user.id ?? randomUUID(),
      name: user.name!,
      email: user.email!,
      passwordHash: user.passwordHash!,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    const index = users.findIndex((existing) => existing.id === saved.id);
    if (index >= 0) users[index] = saved;
    else users.push(saved);
    return saved;
  }),
};

const taskRepository = {
  create: jest.fn((values: Partial<TestTask>) => ({
    id: randomUUID(),
    description: null,
    status: "pending" as const,
    priority: "medium" as const,
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...values,
  })),
  find: jest.fn(async (options: {
    where?: {
      user?: { id?: string };
      status?: TestTask["status"];
      priority?: TestTask["priority"];
    };
  }) => tasks
    .filter((task) => {
      const where = options.where ?? {};
      return (!where.user?.id || task.user.id === where.user.id)
        && (!where.status || task.status === where.status)
        && (!where.priority || task.priority === where.priority);
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())),
  findOne: jest.fn(async (options: {
    where?: { id?: string; user?: { id?: string } };
  }) => tasks.find((task) =>
    task.id === options.where?.id
      && task.user.id === options.where?.user?.id
  ) ?? null),
  merge: jest.fn((task: TestTask, values: Partial<TestTask>) => Object.assign(task, values)),
  save: jest.fn(async (task: Partial<TestTask>) => {
    const saved: TestTask = {
      id: task.id ?? randomUUID(),
      title: task.title!,
      description: task.description ?? null,
      status: task.status ?? "pending",
      priority: task.priority ?? "medium",
      dueDate: task.dueDate ?? null,
      createdAt: task.createdAt ?? new Date(),
      updatedAt: new Date(),
      user: task.user!,
    };
    const index = tasks.findIndex((existing) => existing.id === saved.id);
    if (index >= 0) tasks[index] = saved;
    else tasks.push(saved);
    return saved;
  }),
  remove: jest.fn(async (task: TestTask) => {
    const index = tasks.findIndex((existing) => existing.id === task.id);
    if (index >= 0) tasks.splice(index, 1);
    return task;
  }),
};

const getRepositoryMock = AppDataSource.getRepository as jest.Mock;

beforeAll(() => {
  process.env.JWT_SECRET_KEY = "integration-test-secret-with-sufficient-length";
});

beforeEach(() => {
  users.splice(0, users.length);
  tasks.splice(0, tasks.length);
  jest.clearAllMocks();
  getRepositoryMock.mockImplementation((entity: unknown) => {
    if (entity === User) return userRepository;
    if (entity === Task) return taskRepository;
    throw new Error("Unexpected entity repository requested by test.");
  });
});

async function registerUser(name: string, email: string) {
  const response = await request(app).post("/api/v1/auth/register").send({
    name,
    email,
    password: "correct-horse-battery",
  });
  expect(response.status).toBe(201);
  expect(response.body.accessToken).toEqual(expect.any(String));
  return {
    user: response.body.user as { id: string; email: string },
    token: response.body.accessToken as string,
  };
}

function withToken(token: string) {
  return { Authorization: `Bearer ${token}` };
}

describe("Task API end-to-end flow (in-memory repository)", () => {
  it("registers a user and uses the returned JWT to create, retrieve, update, and delete a task", async () => {
    const { token, user } = await registerUser("Task Owner", "owner@example.com");

    const createResponse = await request(app)
      .post("/api/v1/tasks")
      .set(withToken(token))
      .send({
        title: "Prepare API tests",
        description: "Cover the main task lifecycle",
        priority: "high",
        dueDate: "2026-10-20",
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toMatchObject({
      title: "Prepare API tests",
      description: "Cover the main task lifecycle",
      status: "pending",
      priority: "high",
      dueDate: "2026-10-20",
      user: { id: user.id },
    });
    const taskId = createResponse.body.data.id as string;

    const listResponse = await request(app)
      .get("/api/v1/tasks")
      .set(withToken(token));
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.data[0].id).toBe(taskId);

    const getResponse = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set(withToken(token));
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.title).toBe("Prepare API tests");

    const updateResponse = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set(withToken(token))
      .send({ title: "API tests completed", status: "completed", priority: "medium" });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data).toMatchObject({
      id: taskId,
      title: "API tests completed",
      status: "completed",
      priority: "medium",
    });

    const deleteResponse = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set(withToken(token));
    expect(deleteResponse.status).toBe(204);

    const missingResponse = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set(withToken(token));
    expect(missingResponse.status).toBe(404);
    expect(missingResponse.body.error.code).toBe("TASK_NOT_FOUND");
  });

  it("allows login to obtain a JWT that can access protected task routes", async () => {
    const { user } = await registerUser("Login User", "login@example.com");
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "LOGIN@example.com",
      password: "correct-horse-battery",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.id).toBe(user.id);
    expect(loginResponse.body.accessToken).toEqual(expect.any(String));

    const taskResponse = await request(app)
      .post("/api/v1/tasks")
      .set(withToken(loginResponse.body.accessToken))
      .send({ title: "Created after login" });
    expect(taskResponse.status).toBe(201);
    expect(taskResponse.body.data.title).toBe("Created after login");
  });

  it("filters tasks by status and priority, including both filters together", async () => {
    const { token } = await registerUser("Filter User", "filters@example.com");
    const auth = withToken(token);

    const fixtures = [
      { title: "Pending high", status: "pending", priority: "high" },
      { title: "Completed high", status: "completed", priority: "high" },
      { title: "Pending low", status: "pending", priority: "low" },
    ];
    for (const fixture of fixtures) {
      const response = await request(app).post("/api/v1/tasks").set(auth).send(fixture);
      expect(response.status).toBe(201);
    }

    const byStatus = await request(app).get("/api/v1/tasks?status=pending").set(auth);
    expect(byStatus.status).toBe(200);
    expect(byStatus.body.data).toHaveLength(2);
    expect(byStatus.body.data.every((task: TestTask) => task.status === "pending")).toBe(true);

    const byPriority = await request(app).get("/api/v1/tasks?priority=high").set(auth);
    expect(byPriority.status).toBe(200);
    expect(byPriority.body.data).toHaveLength(2);
    expect(byPriority.body.data.every((task: TestTask) => task.priority === "high")).toBe(true);

    const combined = await request(app)
      .get("/api/v1/tasks?status=pending&priority=high")
      .set(auth);
    expect(combined.status).toBe(200);
    expect(combined.body.data).toHaveLength(1);
    expect(combined.body.data[0].title).toBe("Pending high");
  });

  it("rejects unauthenticated requests to every task endpoint", async () => {
    const taskId = randomUUID();
    const responses = await Promise.all([
      request(app).get("/api/v1/tasks"),
      request(app).post("/api/v1/tasks").send({ title: "No token" }),
      request(app).get(`/api/v1/tasks/${taskId}`),
      request(app).patch(`/api/v1/tasks/${taskId}`).send({ title: "No token" }),
      request(app).delete(`/api/v1/tasks/${taskId}`),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
    }
    expect(tasks).toHaveLength(0);
  });

  it("prevents a second user from listing, reading, updating, or deleting another user's task", async () => {
    const owner = await registerUser("Owner", "owner-isolation@example.com");
    const createResponse = await request(app)
      .post("/api/v1/tasks")
      .set(withToken(owner.token))
      .send({ title: "Private task", priority: "high" });
    expect(createResponse.status).toBe(201);
    const taskId = createResponse.body.data.id as string;

    const otherUser = await registerUser("Other User", "other-user@example.com");
    const otherAuth = withToken(otherUser.token);

    const listResponse = await request(app).get("/api/v1/tasks").set(otherAuth);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toEqual([]);

    const getResponse = await request(app).get(`/api/v1/tasks/${taskId}`).set(otherAuth);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body.error.code).toBe("TASK_NOT_FOUND");

    const updateResponse = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set(otherAuth)
      .send({ title: "Stolen task" });
    expect(updateResponse.status).toBe(404);
    expect(updateResponse.body.error.code).toBe("TASK_NOT_FOUND");

    const deleteResponse = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set(otherAuth);
    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body.error.code).toBe("TASK_NOT_FOUND");

    const ownerRead = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set(withToken(owner.token));
    expect(ownerRead.status).toBe(200);
    expect(ownerRead.body.data.title).toBe("Private task");
  });

  it("does not allow the client to assign a task to another user", async () => {
    const owner = await registerUser("Payload Owner", "payload-owner@example.com");
    const otherUser = await registerUser("Payload Other", "payload-other@example.com");

    const response = await request(app)
      .post("/api/v1/tasks")
      .set(withToken(owner.token))
      .send({ title: "Attempted reassignment", user_id: otherUser.user.id });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(tasks).toHaveLength(0);
  });
});
