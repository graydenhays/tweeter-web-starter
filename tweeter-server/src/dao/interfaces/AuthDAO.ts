import { AuthTokenDto, UserDto } from "tweeter-shared";
import { TweeterDAO } from "./TweeterDAO";

export interface AuthDAO extends TweeterDAO {
	readonly authToken_attr: string;
	readonly timestamp_attr: string;
	readonly user_attr: string;

	putToken(authToken: AuthTokenDto, user: UserDto): Promise<void>;
	checkToken(token: string): Promise<[AuthTokenDto, UserDto] | undefined>;
	deleteToken(token: string): Promise<void>;
}