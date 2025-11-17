import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetIsFollowerStatusRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  user: string; // alias of current user
  selectedUser: string; // alias of user to check
}
