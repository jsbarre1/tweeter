import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetFollowCountRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  user: string; // alias of user to get count for
}
