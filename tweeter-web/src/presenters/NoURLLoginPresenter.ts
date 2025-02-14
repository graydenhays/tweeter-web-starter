import { UserService } from "../model/service/UserService";
import { LoginPresenter, LoginView } from "./LoginPresenter";

export class NoURLLoginPresenter extends LoginPresenter {

	private userService: UserService;

	public constructor(view: LoginView) {
		super(view);
		this.userService = new UserService();
	}

	public async doLogin() {
		try {
			const [user, authToken] = await this.userService.login(this.view.alias, this.view.password);

			this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);

			this.navigate("/");
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to log user in because of exception: ${error}`
			);
		}
	};
}