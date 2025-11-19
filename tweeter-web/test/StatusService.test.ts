import "isomorphic-fetch";
import { StatusService } from "../src/model.service/StatusService";
import { AuthToken, Status } from "tweeter-shared";

describe("StatusService Integration Tests", () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });


  describe("loadMoreStoryItems", () => {
    it("should successfully retrieve story items", async () => {
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

      expect(statuses).toBeDefined();
      expect(Array.isArray(statuses)).toBe(true);

      statuses.forEach((status) => {
        expect(status).toBeInstanceOf(Status);
        expect(status.post).toBeDefined();
        expect(status.user).toBeDefined();
        expect(status.timestamp).toBeDefined();
        expect(typeof status.timestamp).toBe("number");
      });

      expect(typeof hasMore).toBe("boolean");
    });
  });
});
