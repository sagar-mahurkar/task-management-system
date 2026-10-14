import { TaskSummaryRepository } from "../src/repositories/task-summary.repository";
import { TaskSummaryService } from "../src/services/task-summary.service";

jest.mock("../src/repositories/task-summary.repository", () => ({
  TaskSummaryRepository: { getCountsForUser: jest.fn() },
}));

describe("TaskSummaryService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("converts PostgreSQL count strings to numbers", async () => {
    (TaskSummaryRepository.getCountsForUser as jest.Mock).mockResolvedValueOnce({
      totalTasks: "4",
      pending: "1",
      inProgress: "1",
      completed: "2",
      low: "1",
      medium: "1",
      high: "2",
    });

    await expect(TaskSummaryService.getForUser("user-123")).resolves.toEqual({
      totalTasks: 4,
      byStatus: { pending: 1, in_progress: 1, completed: 2 },
      byPriority: { low: 1, medium: 1, high: 2 },
    });
    expect(TaskSummaryRepository.getCountsForUser).toHaveBeenCalledWith("user-123");
  });

  it.each([
    ["invalid number", Number.NaN],
    ["negative count", -3],
    ["infinite count", Number.POSITIVE_INFINITY],
  ])("normalizes %s to zero", async (_label, invalidCount) => {
    (TaskSummaryRepository.getCountsForUser as jest.Mock).mockResolvedValueOnce({
      totalTasks: invalidCount,
      pending: "not-a-count",
      inProgress: -1,
      completed: "Infinity",
      low: 0,
      medium: 1,
      high: 2,
    });

    await expect(TaskSummaryService.getForUser("user-123")).resolves.toEqual({
      totalTasks: 0,
      byStatus: { pending: 0, in_progress: 0, completed: 0 },
      byPriority: { low: 0, medium: 1, high: 2 },
    });
  });
});
