import { GetUserRequest, GetUserResponse, AuthTokenDto, UserDto } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: GetUserRequest = JSON.parse(event.body);

    const userService = new UserService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);
    const user = await userService.getUser(authToken, request.alias);

    if (!user) {
      const errorResponse: GetUserResponse = {
        success: false,
        message: "User not found",
        user: null!,
      };

      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(errorResponse),
      };
    }

    const response: GetUserResponse = {
      success: true,
      user: UserDto.fromUser(user),
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
    console.error("Error in GetUserLambda:", error);

    const errorResponse: GetUserResponse = {
      success: false,
      message: `[Bad Request] ${(error as Error).message}`,
      user: null!,
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
