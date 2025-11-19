import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  AuthTokenDto,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../service/FollowService";

export const handler = async (event: any) => {
  try {
    const request: PagedUserItemRequest = JSON.parse(event.body);

    const followService = new FollowService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);
    const lastItem = request.lastItem ? UserDto.toUser(request.lastItem) : null;

    const [users, hasMore] = await followService.loadMoreFollowers(
      authToken,
      request.userAlias,
      request.pageSize,
      lastItem
    );

    const response: PagedUserItemResponse = {
      success: true,
      items: users.map((user) => UserDto.fromUser(user)),
      hasMore,
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error in GetFollowersLambda:", error);

    const errorResponse: PagedUserItemResponse = {
      success: false,
      message: `[Bad Request] ${(error as Error).message}`,
      items: [],
      hasMore: false,
    };

    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(errorResponse),
    };
  }
};
