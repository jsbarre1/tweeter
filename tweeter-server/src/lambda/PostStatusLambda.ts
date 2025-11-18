import {
  PostStatusRequest,
  PostStatusResponse,
  AuthTokenDto,
  StatusDto,
} from "tweeter-shared";
import { StatusService } from "../service/StatusService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: PostStatusRequest = JSON.parse(event.body);

    const statusService = new StatusService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);
    const status = StatusDto.toStatus(request.newStatus);

    await statusService.postStatus(authToken, status);

    const response: PostStatusResponse = {
      success: true,
      message: "Status posted successfully",
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
    console.error("Error in PostStatusLambda:", error);

    const errorResponse: PostStatusResponse = {
      success: false,
      message: `[Bad Request] ${(error as Error).message}`,
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
