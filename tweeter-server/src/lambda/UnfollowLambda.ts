import { UnfollowRequest, UnfollowResponse, AuthTokenDto, UserDto } from "tweeter-shared";
import { FollowService } from "../service/FollowService";

export const handler = async (event: any) => {
  try {
    const request: UnfollowRequest = JSON.parse(event.body);

    const followService = new FollowService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);

    const userToUnfollow = { alias: request.userToUnfollow } as any;

    const [followerCount, followeeCount] = await followService.unfollow(
      authToken,
      userToUnfollow
    );

    const response: UnfollowResponse = {
      success: true,
      followerCount,
      followeeCount,
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
    console.error("Error in UnfollowLambda:", error);

    const errorResponse: UnfollowResponse = {
      success: false,
      message: `[Bad Request] ${(error as Error).message}`,
      followerCount: 0,
      followeeCount: 0,
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
