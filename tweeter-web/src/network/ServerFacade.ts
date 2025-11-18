import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
  GetUserRequest,
  GetUserResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  FollowRequest,
  FollowResponse,
  UnfollowRequest,
  UnfollowResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  User,
  AuthToken,
  Status,
  UserDto,
  AuthTokenDto,
  StatusDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

/**
 * ServerFacade provides a simple interface for the client to call backend API endpoints
 * Implements the Facade pattern to hide the complexity of network communication
 */
export class ServerFacade {
  private SERVER_URL = "https://ie1aofz86k.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  /**
   * Login a user
   */
  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias,
      password,
    };

    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/login");

    if (response.success) {
      const user = UserDto.toUser(response.user);
      const authToken = AuthTokenDto.toAuthToken(response.authToken);
      return [user, authToken];
    } else {
      throw new Error(response.message ?? "Login failed");
    }
  }

  /**
   * Register a new user
   */
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ): Promise<[User, AuthToken]> {
    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
    };

    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/register");

    if (response.success) {
      const user = UserDto.toUser(response.user);
      const authToken = AuthTokenDto.toAuthToken(response.authToken);
      return [user, authToken];
    } else {
      throw new Error(response.message ?? "Registration failed");
    }
  }

  /**
   * Logout a user
   */
  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
    };

    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/logout");

    if (!response.success) {
      throw new Error(response.message ?? "Logout failed");
    }
  }

  /**
   * Get a user by alias
   */
  public async getUser(authToken: AuthToken, alias: string): Promise<User> {
    const request: GetUserRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      alias,
    };

    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user");

    if (response.success) {
      return UserDto.toUser(response.user);
    } else {
      throw new Error(response.message ?? "Get user failed");
    }
  }

  /**
   * Get a page of followees
   */
  public async getMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      userAlias,
      pageSize,
      lastItem: lastItem ? UserDto.fromUser(lastItem) : null,
    };

    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followees");

    if (response.success) {
      const items = response.items.map((dto) => UserDto.toUser(dto));
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Get followees failed");
    }
  }

  /**
   * Get a page of followers
   */
  public async getMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      userAlias,
      pageSize,
      lastItem: lastItem ? UserDto.fromUser(lastItem) : null,
    };

    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followers");

    if (response.success) {
      const items = response.items.map((dto) => UserDto.toUser(dto));
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Get followers failed");
    }
  }

  /**
   * Follow a user
   */
  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[number, number]> {
    const request: FollowRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      userToFollow: userToFollow.alias,
    };

    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(response.message ?? "Follow failed");
    }
  }

  /**
   * Unfollow a user
   */
  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[number, number]> {
    const request: UnfollowRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      userToUnfollow: userToUnfollow.alias,
    };

    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      UnfollowResponse
    >(request, "/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(response.message ?? "Unfollow failed");
    }
  }

  /**
   * Check if user is following another user
   */
  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: GetIsFollowerStatusRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      user: user.alias,
      selectedUser: selectedUser.alias,
    };

    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, "/is-follower");

    if (response.success) {
      return response.isFollower;
    } else {
      throw new Error(response.message ?? "Get follower status failed");
    }
  }

  /**
   * Get follower count for a user
   */
  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    const request: GetFollowCountRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      user: user.alias,
    };

    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follower-count");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Get follower count failed");
    }
  }

  /**
   * Get followee count for a user
   */
  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    const request: GetFollowCountRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      user: user.alias,
    };

    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/followee-count");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Get followee count failed");
    }
  }

  /**
   * Get a page of story items
   */
  public async getMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      userAlias,
      pageSize,
      lastItem: lastItem ? StatusDto.fromStatus(lastItem) : null,
    };

    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story");

    if (response.success) {
      const items = response.items.map((dto) => StatusDto.toStatus(dto));
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Get story failed");
    }
  }

  /**
   * Get a page of feed items
   */
  public async getMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      userAlias,
      pageSize,
      lastItem: lastItem ? StatusDto.fromStatus(lastItem) : null,
    };

    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed");

    if (response.success) {
      const items = response.items.map((dto) => StatusDto.toStatus(dto));
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Get feed failed");
    }
  }

  /**
   * Post a status
   */
  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request: PostStatusRequest = {
      authToken: AuthTokenDto.fromAuthToken(authToken),
      newStatus: StatusDto.fromStatus(newStatus),
    };

    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status");

    if (!response.success) {
      throw new Error(response.message ?? "Post status failed");
    }
  }
}
