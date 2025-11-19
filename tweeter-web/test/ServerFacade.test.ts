import "isomorphic-fetch";
import { ServerFacade } from "../src/network/ServerFacade";
import { AuthToken, User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });


  describe("Register", () => {
    it("should register a new user and return user and auth token", async () => {
      const firstName = "Test";
      const lastName = "User";
      const alias = "@testuser";
      const password = "password";
      const imageStringBase64 = "dGVzdGltYWdl"; 

      const [user, authToken] = await serverFacade.register(
        firstName,
        lastName,
        alias,
        password,
        imageStringBase64
      );

      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user.firstName).toBeDefined();
      expect(user.lastName).toBeDefined();
      expect(user.alias).toBeDefined();

      expect(authToken).toBeDefined();
      expect(authToken).toBeInstanceOf(AuthToken);
      expect(authToken.token).toBeDefined();
      expect(authToken.timestamp).toBeDefined();
      expect(typeof authToken.timestamp).toBe("number");
    });
  });


  describe("GetFollowers", () => {
    it("should return a page of followers", async () => {
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

      expect(followers).toBeDefined();
      expect(Array.isArray(followers)).toBe(true);

      followers.forEach((follower) => {
        expect(follower).toBeInstanceOf(User);
        expect(follower.firstName).toBeDefined();
        expect(follower.lastName).toBeDefined();
        expect(follower.alias).toBeDefined();
      });

      expect(typeof hasMore).toBe("boolean");
    });
  });


  describe("GetFollowingCount", () => {
    it("should return the followee count for a user", async () => {
      const authToken = new AuthToken("test-token", Date.now());
      const user = new User("Test", "User", "@testuser", "image.png");

      const count = await serverFacade.getFolloweeCount(authToken, user);

      expect(count).toBeDefined();
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
