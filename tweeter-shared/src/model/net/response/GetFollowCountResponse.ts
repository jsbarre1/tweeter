import { TweeterResponse } from "./TweeterResponse";

export interface GetFollowCountResponse extends TweeterResponse {
  count: number;
}
