import { AuthToken } from "../../domain/AuthToken";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthResponse extends TweeterResponse {
	returnedUser: UserDto,
	authToken: AuthToken
}