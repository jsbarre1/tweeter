import { RegisterRequest, RegisterResponse, UserDto, AuthTokenDto } from "tweeter-shared";
import { UserService } from "../service/UserService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: RegisterRequest = JSON.parse(event.body);

    const userService = new UserService();
    const [user, authToken] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.imageStringBase64
    );

    const response: RegisterResponse = {
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
    console.error("Error in RegisterLambda:", error);

    const errorResponse: RegisterResponse = {
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
