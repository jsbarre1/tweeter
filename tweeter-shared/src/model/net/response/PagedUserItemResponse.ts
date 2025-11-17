import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";

export interface PagedUserItemResponse extends TweeterResponse {
  items: UserDto[];
  hasMore: boolean;
}
