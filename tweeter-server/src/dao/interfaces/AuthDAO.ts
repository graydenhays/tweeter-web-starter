import { AuthTokenDto } from "tweeter-shared";
import { TweeterDAO } from "./TweeterDAO";

export interface AuthDAO extends TweeterDAO {
	readonly authToken_attr: string;
	readonly timestamp_attr: string;
	readonly user_alias_attr: string;

	putToken(authToken: AuthTokenDto, alias: string): Promise<void>;
	checkToken(token: string): Promise<boolean>;
	deleteToken(token: string): Promise<void>;
	getAliasFromToken(token: string): Promise<string | undefined>;
}