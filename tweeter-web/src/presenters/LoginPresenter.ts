import { AuthPresenter, AuthView } from "./AuthPresenter";
export class LoginPresenter extends AuthPresenter<AuthView> {

	public constructor(view: AuthView) {
		super(view);
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