import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface LoginView {
	updateUserInfo: (
		user: User,
		user2: User,
		authToken: AuthToken,
		rememberMe: boolean
	) => void
	displayErrorMessage: (message: string) => void
	originalUrl: string | undefined
	alias: string
	password: string
	rememberMe: boolean
}

export abstract class LoginPresenter {
	private _view: LoginView;
	private _navigate: NavigateFunction = useNavigate();

	public constructor(view: LoginView) {
		this._view = view;
	}

	protected get view() {
		return this._view
	}

	protected get navigate() {
		return this._navigate;
	}

	public abstract doLogin(): void;
}