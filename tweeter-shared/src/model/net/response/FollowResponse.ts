import { FollowCountResponse } from "./FollowCountResponse";
import { TweeterResponse } from "./TweeterResponse";

export interface FollowResponse extends FollowCountResponse {
	followCount2: number
}