import "isomorphic-fetch";
import { StatusService } from "../model.service/StatusService";
import { AuthToken, Status } from "tweeter-shared";

describe("StatusService Integration Tests", () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });

  /**
   * Test: Load More Story Items
   * Verifies that the StatusService can successfully retrieve a page of story items
   */
  describe("loadMoreStoryItems", () => {
    it("should successfully retrieve story items", async () => {
      // Use a dummy auth token for testing
      const authToken = new AuthToken("test-token", Date.now());
      const userAlias = "@testuser";
      const pageSize = 10;
      const lastItem = null;

      const [statuses, hasMore] = await statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        pageSize,
        lastItem
      );

      // Verify statuses are returned
      expect(statuses).toBeDefined();
      expect(Array.isArray(statuses)).toBe(true);

      // Verify each status is a Status object
      statuses.forEach((status) => {
        expect(status).toBeInstanceOf(Status);
        expect(status.post).toBeDefined();
        expect(status.user).toBeDefined();
        expect(status.timestamp).toBeDefined();
        expect(typeof status.timestamp).toBe("number");
      });

      // Verify hasMore is a boolean
      expect(typeof hasMore).toBe("boolean");
    });
  });
});
