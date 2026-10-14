import { AppDataSource } from "../src/database/dataSource";
import { TaskSummaryRepository } from "../src/repositories/task-summary.repository";
import type { TaskSummaryCounts } from "../src/repositories/task-summary.repository";

jest.mock("../src/database/dataSource", () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

describe("TaskSummaryRepository", () => {
  const getRawOne = jest.fn();
  const where = jest.fn();
  const select = jest.fn();
  const addSelect = jest.fn();
  const queryBuilder = { select, addSelect, where, getRawOne };

  beforeEach(() => {
    jest.clearAllMocks();
    select.mockReturnValue(queryBuilder);
    addSelect.mockReturnValue(queryBuilder);
    where.mockReturnValue(queryBuilder);
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    });
  });

  it("returns zero counts if the aggregate query unexpectedly returns no row", async () => {
    getRawOne.mockResolvedValueOnce(undefined);

    await expect(TaskSummaryRepository.getCountsForUser("user-123")).resolves.toEqual({
      totalTasks: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      low: 0,
      medium: 0,
      high: 0,
    });
    expect(where).toHaveBeenCalledWith("task.user_id = :userId", { userId: "user-123" });
  });

  it("returns aggregate counts from the query result", async () => {
    const counts: TaskSummaryCounts = {
      totalTasks: "4",
      pending: "1",
      inProgress: "1",
      completed: "2",
      low: "1",
      medium: "1",
      high: "2",
    };
    getRawOne.mockResolvedValueOnce(counts);

    await expect(TaskSummaryRepository.getCountsForUser("user-456")).resolves.toBe(counts);
    expect(where).toHaveBeenCalledWith("task.user_id = :userId", { userId: "user-456" });
  });
});
