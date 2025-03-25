import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export interface GetUserResponse extends TweeterResponse {
	returnedUser: User | null
}