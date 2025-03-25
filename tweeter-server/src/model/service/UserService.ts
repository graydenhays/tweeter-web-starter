import { Buffer } from "buffer";
import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";

export class UserService {
	public async login(
		alias: string,
		password: string
	): Promise<[UserDto, AuthToken]> {
		return this.getFakeData("Invalid alias or password");
	};

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		userImageBytes: Uint8Array,
		imageFileExtension: string
	): Promise<[UserDto, AuthToken]> {
		// Not neded now, but will be needed when you make the request to the server in milestone 3
		const imageStringBase64: string =
		  Buffer.from(userImageBytes).toString("base64");

		return this.getFakeData("Invalid registration");
	};

	private async getFakeData(message: string): Promise<[UserDto, AuthToken]> {
		// TODO: Replace with the result of calling the server
		const user = FakeData.instance.firstUser;

		if (user === null) {
			throw new Error(message);
		}

		return [user.dto, FakeData.instance.authToken];
	}

	public async getUser (
		token: string,
		alias: string
	): Promise<User | null> {
		// TODO: Replace with the result of calling server
		const user = FakeData.instance.findUserByAlias(alias);
		return User.fromDto(user);
	};

	public async logout (token: string): Promise<void> {
		// Pause so we can see the logging out message. Delete when the call to the server is implemented.
		await new Promise((res) => setTimeout(res, 1000));
	};
}