import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface FollowRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  userToFollow: string; // alias of user to follow
}
