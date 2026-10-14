import type { Request, Response } from "express";
import { z } from "zod";
import { errorMiddleware } from "../src/middleware/error.middleware";
import { AppError } from "../src/utils/AppError";

function createResponseMock() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response & {
    status: jest.Mock;
    json: jest.Mock;
  };
}

describe("errorMiddleware", () => {
  it("serializes application errors using their status, code, and message", () => {
    const response = createResponseMock();

    errorMiddleware(
      new AppError(403, "FORBIDDEN", "Access denied."),
      {} as Request,
      response,
      jest.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      error: { code: "FORBIDDEN", message: "Access denied." },
    });
  });

  it("serializes Zod validation issues without exposing unrelated data", () => {
    const response = createResponseMock();
    const parsed = z.object({ title: z.string() }).safeParse({ title: 123 });
    if (parsed.success) throw new Error("Test fixture should be invalid.");

    errorMiddleware(parsed.error, {} as Request, response, jest.fn());

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: [{ path: "title", message: expect.any(String) }],
      },
    });
  });

  it("normalizes malformed JSON parser errors", () => {
    const response = createResponseMock();

    errorMiddleware(
      { status: 400, type: "entity.parse.failed", message: "Sensitive parser detail" },
      {} as Request,
      response,
      jest.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: "INVALID_JSON",
        message: "Request body contains invalid JSON.",
      },
    });
  });

  it("returns a generic response for unexpected errors without leaking the exception", () => {
    const response = createResponseMock();
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const secretMessage = "database password or internal SQL detail";

    try {
      errorMiddleware(new Error(secretMessage), {} as Request, response, jest.fn());

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
        },
      });
      expect(JSON.stringify(response.json.mock.calls[0])).not.toContain(secretMessage);
      expect(consoleError).toHaveBeenCalledWith("Unhandled request error:", expect.any(Error));
    } finally {
      consoleError.mockRestore();
    }
  });
});
