import { LoginRequest, LoginResponse, UserDto, AuthTokenDto } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (event: any) => {
  try {
    const request: LoginRequest = JSON.parse(event.body);

    const userService = new UserService();
    const [user, authToken] = await userService.login(request.alias, request.password);

    const response: LoginResponse = {
      success: true,
      user: UserDto.fromUser(user),
      authToken: AuthTokenDto.fromAuthToken(authToken),
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
    console.error("Error in LoginLambda:", error);

    const errorResponse: LoginResponse = {
      success: false,
      message: `[Bad Request] ${(error as Error).message}`,
      user: null!,
      authToken: null!,
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
