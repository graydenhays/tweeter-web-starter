import { AuthRequest, AuthResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService"

export const handler = async (request: AuthRequest): Promise<AuthResponse | TweeterResponse> => {
	const userService = new UserService();
	try {
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
	catch (error: any) {
		throw new Error('[BadRequest] error logging in');
		// return {
		// 	success: false,
		// 	message: error.message ?? "Error logging in"
		// }
	}
}