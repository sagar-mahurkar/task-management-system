import request from "supertest";
import app from "../src/app";

describe("GET /health", () => {
  it("returns HTTP 200 and an OK status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("unknown routes", () => {
  it("returns a consistent 404 error response", async () => {
    const response = await request(app).get("/api/v1/not-a-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: "NOT_FOUND", message: "Resource not found." },
    });
  });
});


describe("malformed request bodies", () => {
  it("returns a stable 400 response for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "INVALID_JSON",
        message: "Request body contains invalid JSON.",
      },
    });
  });
});
