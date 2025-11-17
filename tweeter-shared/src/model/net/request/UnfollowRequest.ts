import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface UnfollowRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  userToUnfollow: string; // alias of user to unfollow
}
