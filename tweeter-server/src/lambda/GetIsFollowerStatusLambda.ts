import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  AuthTokenDto,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../service/FollowService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: GetIsFollowerStatusRequest = JSON.parse(event.body);

    const followService = new FollowService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);

    // Create user objects from aliases
    // TODO: In Milestone 4, fetch the full users from the database
    const user = { alias: request.user } as any;
    const selectedUser = { alias: request.selectedUser } as any;

    const isFollower = await followService.getIsFollowerStatus(
      authToken,
      user,
      selectedUser
    );

    const response: GetIsFollowerStatusResponse = {
      success: true,
      isFollower,
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
    console.error("Error in GetIsFollowerStatusLambda:", error);

    const errorResponse: GetIsFollowerStatusResponse = {
      success: false,
      message: `[Bad Request] ${(error as Error).message}`,
      isFollower: false,
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
