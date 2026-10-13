import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/database/dataSource";
import { User } from "../src/entities/User";

jest.mock("../src/database/dataSource", () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

type UserRepositoryMock = {
  findOneBy: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

const repository: UserRepositoryMock = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const testUser = {
  id: "b1c6d2a0-3e7d-4f4a-8c3e-1d2f3a4b5c6d",
  name: "Test User",
  email: "test@example.com",
  passwordHash: "",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

beforeAll(() => {
  process.env.JWT_SECRET_KEY = "test-secret-key-for-auth-tests";
});

beforeEach(() => {
  jest.clearAllMocks();
  (AppDataSource.getRepository as jest.Mock).mockReturnValue(repository);
  repository.findOneBy.mockResolvedValue(null);
  repository.create.mockImplementation((values) => ({ ...testUser, ...values }));
  repository.save.mockImplementation(async (user) => ({ ...testUser, ...user }));
});

describe("authentication API", () => {
  it("registers a user, hashes the password, and returns an access token", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: " Test User ",
      email: "TEST@example.com",
      password: "correct-horse-battery",
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      id: testUser.id,
      name: "Test User",
      email: "test@example.com",
    });
    expect(response.body.user.passwordHash).toBeUndefined();
    expect(typeof response.body.accessToken).toBe("string");
    expect(await bcrypt.compare("correct-horse-battery", repository.save.mock.calls[0][0].passwordHash)).toBe(true);
  });

  it("rejects invalid registration input", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "",
      email: "not-an-email",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("rejects an already registered email", async () => {
    repository.findOneBy.mockResolvedValueOnce(testUser);

    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "correct-horse-battery",
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("EMAIL_ALREADY_REGISTERED");
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("logs in with valid credentials", async () => {
    const passwordHash = await bcrypt.hash("correct-horse-battery", 4);
    repository.findOneBy.mockResolvedValueOnce({ ...testUser, passwordHash });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "TEST@example.com",
      password: "correct-horse-battery",
    });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("test@example.com");
    expect(typeof response.body.accessToken).toBe("string");
  });

  it("rejects invalid credentials with a generic message", async () => {
    repository.findOneBy.mockResolvedValueOnce(null);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "missing@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
    expect(response.body.error.message).toBe("Email or password is incorrect.");
  });

  it("requires a bearer token for the current-user endpoint", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("returns the current user for a valid bearer token", async () => {
    const token = jwt.sign({}, process.env.JWT_SECRET_KEY!, {
      algorithm: "HS256",
      subject: testUser.id,
      expiresIn: "1h",
    });
    repository.findOneBy.mockResolvedValueOnce(testUser);

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ id: testUser.id, email: testUser.email });
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it("rejects an invalid bearer token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer not-a-valid-token");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_TOKEN");
  });
});
