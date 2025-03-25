import { AuthRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService"

export const handler = async (request: AuthRequest): Promise<AuthResponse> => {
	const userService = new UserService();
	const [userDto, authToken] = await userService.login(
		request.alias,
		request.password
	)

	return {
		success: true,
		message: undefined,
		returnedUser: userDto,
		authToken: authToken
	}
}