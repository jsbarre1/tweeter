import { LogoutRequest, LogoutResponse, AuthTokenDto } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: LogoutRequest = JSON.parse(event.body);

    const userService = new UserService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);
    await userService.logout(authToken);

    const response: LogoutResponse = {
      success: true,
      message: "Successfully logged out",
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
    console.error("Error in LogoutLambda:", error);

    const errorResponse: LogoutResponse = {
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
