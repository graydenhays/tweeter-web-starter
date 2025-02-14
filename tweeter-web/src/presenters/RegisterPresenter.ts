import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface RegisterView {
	updateUserInfo: (
		user: User,
		user2: User,
		authToken: AuthToken,
		rememberMe: boolean
	) => void
	displayErrorMessage: (message: string) => void
	alias: string
	password: string
	rememberMe: boolean
	firstName: string
	lastName: string
	imageBytes: Uint8Array
	imageFileExtension: string
}

export class RegisterPresenter {
	private userService: UserService;
	private view: RegisterView;
	private navigate: NavigateFunction = useNavigate();

	public constructor(view: RegisterView) {
		this.view = view;
		this.userService = new UserService();
	}

	public async doRegister() {
		try {
		  const [user, authToken] = await this.userService.register(
			this.view.firstName,
			this.view.lastName,
			this.view.alias,
			this.view.password,
			this.view.imageBytes,
			this.view.imageFileExtension
		  );

		  this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
		  this.navigate("/");
		} catch (error) {
		  this.view.displayErrorMessage(
			`Failed to register user because of exception: ${error}`
		  );
		}
	};
}