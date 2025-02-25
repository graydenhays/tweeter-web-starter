import { UserService } from "../model/service/UserService";
import { AuthView, Presenter } from "./Presenter";

export class LoginPresenter extends Presenter<AuthView> {
	private userService: UserService;

	public constructor(view: AuthView) {
		super(view);
		this.userService = new UserService();
	}

	public async doLogin(
		originalUrl: string | undefined,
		alias: string,
		password: string,
		rememberMe: boolean
	) {
		this.doFailureReportingOperation(async () => {
			this.authenticate(() => this.userService.login(
				alias,
				password
			), rememberMe, this.view);
			this.authNavigate(originalUrl);
		}, "log user in");
	};
}