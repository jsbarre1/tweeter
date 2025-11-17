import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetUserRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  alias: string;
}
