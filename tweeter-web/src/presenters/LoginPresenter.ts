import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserService } from "../model/service/UserService";

export interface LoginView {
	updateUserInfo: (
		user: User,
		user2: User,
		authToken: AuthToken,
		rememberMe: boolean
	) => void
	displayErrorMessage: (message: string) => void
}

export class LoginPresenter {
	private view: LoginView;
	private navigate: NavigateFunction = useNavigate();
	private userService: UserService;

	public constructor(view: LoginView) {
		this.view = view;
		this.userService = new UserService();
	}

	public async doLogin(
		originalUrl: string | undefined,
		alias: string,
		password: string,
		rememberMe: boolean
	) {
		try {
			const [user, authToken] = await this.userService.login(alias, password);

			this.view.updateUserInfo(user, user, authToken, rememberMe);
			if (originalUrl) {
				this.navigate(originalUrl!);
			}
			else {
				this.navigate("/");
			}
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to log user in because of exception: ${error}`
			);
		}
	};
}