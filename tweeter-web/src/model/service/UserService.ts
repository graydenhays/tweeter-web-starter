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
			token: undefined,
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
		// Not neded now, but will be needed when you make the request to the server in milestone 3
		const imageStringBase64: string =
		  Buffer.from(userImageBytes).toString("base64");

		// TODO: Replace with the result of calling the server
		// const user = FakeData.instance.firstUser;

		// if (user === null) {
		//   throw new Error("Invalid registration");
		// }

		// return [user, FakeData.instance.authToken];

		const [userDto, authToken] = await this.facade.getAuth({
			token: undefined,
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
		// TODO: Replace with the result of calling server
		// return FakeData.instance.findUserByAlias(alias);
		const user = await this.facade.getUser({
			token: authToken.token,
			userAlias: alias
		});
		return User.fromDto(user);
	};

	public async logout (authToken: AuthToken): Promise<void> {
		// Pause so we can see the logging out message. Delete when the call to the server is implemented.
		this.facade.logout({
			token: authToken.token
		});
		await new Promise((res) => setTimeout(res, 1000));
	};
}