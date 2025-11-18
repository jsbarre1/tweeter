import { FollowRequest, FollowResponse, AuthTokenDto, UserDto } from "tweeter-shared";
import { FollowService } from "../service/FollowService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: FollowRequest = JSON.parse(event.body);

    const followService = new FollowService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);

    // Create a user object from the alias
    // TODO: In Milestone 4, fetch the full user from the database
    const userToFollow = { alias: request.userToFollow } as any;

    const [followerCount, followeeCount] = await followService.follow(
      authToken,
      userToFollow
    );

    const response: FollowResponse = {
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
    console.error("Error in FollowLambda:", error);

    const errorResponse: FollowResponse = {
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
