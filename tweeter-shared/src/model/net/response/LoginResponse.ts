import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface LoginResponse extends TweeterResponse {
  user: UserDto;
  authToken: AuthTokenDto;
}
