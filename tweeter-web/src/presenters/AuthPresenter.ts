import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";
// import { NavigateFunction, NavigateOptions, To, useNavigate } from "react-router-dom";

export interface AuthView extends View {
	updateUserInfo: (
		user: User,
		user2: User,
		authToken: AuthToken,
		rememberMe: boolean
	) => void
}
// create AuthenticatePresenter and inherit from that
export abstract class AuthPresenter<V extends AuthView> extends Presenter<V> {
	private _userService: UserService;

	public constructor(view: V) {
		super(view);
		this._userService = new UserService();
	}

	protected get userService() {
		return this._userService;
	}

	protected async authenticate(authFunc: () => Promise<[User, AuthToken]>, rememberMe: boolean, view: V): Promise<void> {
		const [user, authToken] = await authFunc();
		view.updateUserInfo(user, user, authToken, rememberMe);
	}

	protected authNavigate(navString?: string) {
		if (navString) {
			this.navigate(navString);
		}
		else {
			this.navigate("/");
		}
	}

}