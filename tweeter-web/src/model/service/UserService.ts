import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
	private facade = new ServerFacade();

	public async login(
		alias: string,
		password: string
	): Promise<[User, AuthToken]> {
		const [userDto, authToken] = await this.facade.getAuth({
			token: "",
			alias: alias,
			password: password
		}, "/login", "Unrecognized user");
		return [User.fromDto(userDto)!, authToken]
	};

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		userImageBytes: Uint8Array,
		imageFileExtension: string
	): Promise<[User, AuthToken]> {
		const imageStringBase64: string =
		  Buffer.from(userImageBytes).toString("base64");

		const [userDto, authToken] = await this.facade.getAuth({
			token: "",
			alias: alias,
			password: password,
			firstName: firstName,
			lastName: lastName,
			userImageBytes: imageStringBase64,
			imageFileExtension: imageFileExtension
		}, "/register", "User could not be registered");

		return [User.fromDto(userDto)!, authToken]
	};

	public async getUser (
		authToken: AuthToken,
		alias: string
	): Promise<User | null> {
		const user = await this.facade.getUser({
			token: authToken.token,
			userAlias: alias
		});
		return User.fromDto(user);
	};

	public async logout (authToken: AuthToken): Promise<void> {
		this.facade.logout({
			token: authToken.token
		});
		await new Promise((res) => setTimeout(res, 1000));
	};
}