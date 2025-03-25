import { RegisterRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService"

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
	const userService = new UserService();
	const [userDto, authToken] = await userService.register(
		request.firstName,
		request.lastName,
		request.alias,
		request.password,
		request.userImageBytes,
		request.imageFileExtension
	);

	return {
		success: true,
		message: undefined,
		returnedUser: userDto,
		authToken: authToken
	}
}