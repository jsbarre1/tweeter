import "isomorphic-fetch";
import { ServerFacade } from "../network/ServerFacade";
import { AuthToken, User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  /**
   * Test: Register
   * Verifies that the register endpoint returns a user and auth token
   */
  describe("Register", () => {
    it("should register a new user and return user and auth token", async () => {
      const firstName = "Test";
      const lastName = "User";
      const alias = "@testuser";
      const password = "password";
      const imageStringBase64 = "dGVzdGltYWdl"; // "testimage" in base64

      const [user, authToken] = await serverFacade.register(
        firstName,
        lastName,
        alias,
        password,
        imageStringBase64
      );

      // Verify user is returned
      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user.firstName).toBeDefined();
      expect(user.lastName).toBeDefined();
      expect(user.alias).toBeDefined();

      // Verify auth token is returned
      expect(authToken).toBeDefined();
      expect(authToken).toBeInstanceOf(AuthToken);
      expect(authToken.token).toBeDefined();
      expect(authToken.timestamp).toBeDefined();
      expect(typeof authToken.timestamp).toBe("number");
    });
  });

  /**
   * Test: GetFollowers
   * Verifies that the getMoreFollowers endpoint returns a page of followers
   */
  describe("GetFollowers", () => {
    it("should return a page of followers", async () => {
      // Use a dummy auth token for testing
      const authToken = new AuthToken("test-token", Date.now());
      const userAlias = "@testuser";
      const pageSize = 10;
      const lastItem = null;

      const [followers, hasMore] = await serverFacade.getMoreFollowers(
        authToken,
        userAlias,
        pageSize,
        lastItem
      );

      // Verify followers are returned
      expect(followers).toBeDefined();
      expect(Array.isArray(followers)).toBe(true);

      // Verify each follower is a User object
      followers.forEach((follower) => {
        expect(follower).toBeInstanceOf(User);
        expect(follower.firstName).toBeDefined();
        expect(follower.lastName).toBeDefined();
        expect(follower.alias).toBeDefined();
      });

      // Verify hasMore is a boolean
      expect(typeof hasMore).toBe("boolean");
    });
  });

  /**
   * Test: GetFollowingCount (Followee Count)
   * Verifies that the getFolloweeCount endpoint returns a count
   */
  describe("GetFollowingCount", () => {
    it("should return the followee count for a user", async () => {
      // Use a dummy auth token for testing
      const authToken = new AuthToken("test-token", Date.now());
      const user = new User("Test", "User", "@testuser", "image.png");

      const count = await serverFacade.getFolloweeCount(authToken, user);

      // Verify count is returned
      expect(count).toBeDefined();
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
