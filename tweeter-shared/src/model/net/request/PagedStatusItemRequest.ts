import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusItemRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  userAlias: string;
  pageSize: number;
  lastItem: StatusDto | null;
}
