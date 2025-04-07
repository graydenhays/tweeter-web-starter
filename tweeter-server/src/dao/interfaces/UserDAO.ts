import { UserDto } from "tweeter-shared";
import { TweeterDAO } from "./TweeterDAO";

export interface UserDAO extends TweeterDAO {
	readonly user_handle_attr: string;
	readonly user_firstName_attr: string;
	readonly user_lastName_attr: string;
	readonly user_imageUrl_attr: string;
	readonly user_password_attr: string;

	putUser(user: UserDto, password: string): Promise<void>;
	updateUser(user: UserDto): Promise<void>;
	getUser(userAlias: string): Promise<[UserDto, string] | undefined>;
	deleteUser(user: UserDto): Promise<void>;
}