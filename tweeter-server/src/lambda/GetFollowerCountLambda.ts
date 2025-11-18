import {
  GetFollowCountRequest,
  GetFollowCountResponse,
  AuthTokenDto,
} from "tweeter-shared";
import { FollowService } from "../service/FollowService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: GetFollowCountRequest = JSON.parse(event.body);

    const followService = new FollowService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);

    // Create user object from alias
    // TODO: In Milestone 4, fetch the full user from the database
    const user = { alias: request.user } as any;

    const count = await followService.getFollowerCount(authToken, user);

    const response: GetFollowCountResponse = {
      success: true,
      count,
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
    console.error("Error in GetFollowerCountLambda:", error);

    const errorResponse: GetFollowCountResponse = {
      success: false,
      message: `[Bad Request] ${(error as Error).message}`,
      count: 0,
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
