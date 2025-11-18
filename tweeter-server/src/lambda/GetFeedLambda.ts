import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  AuthTokenDto,
  StatusDto,
} from "tweeter-shared";
import { StatusService } from "../service/StatusService";

export const handler = async (event: any) => {
  try {
    // Parse the request body from API Gateway
    const request: PagedStatusItemRequest = JSON.parse(event.body);

    const statusService = new StatusService();
    const authToken = AuthTokenDto.toAuthToken(request.authToken);
    const lastItem = request.lastItem ? StatusDto.toStatus(request.lastItem) : null;

    const [statuses, hasMore] = await statusService.loadMoreFeedItems(
      authToken,
      request.userAlias,
      request.pageSize,
      lastItem
    );

    const response: PagedStatusItemResponse = {
      success: true,
      items: statuses.map((status) => StatusDto.fromStatus(status)),
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
    console.error("Error in GetFeedLambda:", error);

    const errorResponse: PagedStatusItemResponse = {
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
