import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

export interface PagedUserItemRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  userAlias: string;
  pageSize: number;
  lastItem: UserDto | null;
}
