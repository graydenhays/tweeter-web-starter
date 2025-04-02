import { FollowCountResponse } from "./FollowCountResponse";
import { TweeterResponse } from "./TweeterResponse";

export interface FollowResponse extends FollowCountResponse {
	readonly followCount2: number
}