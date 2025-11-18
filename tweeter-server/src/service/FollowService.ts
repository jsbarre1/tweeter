import { AuthToken, FakeData, User } from "tweeter-shared";

/**
 * Server-side FollowService
 * For Milestone 3, returns dummy data from FakeData
 * For Milestone 4, will be updated to use DAOs for database access
 */
export class FollowService {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Milestone 4 - Validate auth token and fetch from database
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Milestone 4 - Validate auth token and fetch from database
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Milestone 4 - Validate auth token and check database
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    // TODO: Milestone 4 - Validate auth token and fetch count from database
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    // TODO: Milestone 4 - Validate auth token and fetch count from database
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Milestone 4 - Validate auth token and create follow relationship in database
    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Milestone 4 - Validate auth token and remove follow relationship from database
    const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
