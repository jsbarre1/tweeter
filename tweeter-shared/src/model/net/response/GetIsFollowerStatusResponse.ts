import { TweeterResponse } from "./TweeterResponse";

export interface GetIsFollowerStatusResponse extends TweeterResponse {
  isFollower: boolean;
}
