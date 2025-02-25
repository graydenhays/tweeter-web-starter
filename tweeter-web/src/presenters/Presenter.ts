import { NavigateFunction, NavigateOptions, To, useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";

export interface View {
	displayErrorMessage: (message: string) => void
}

export interface MessageView extends View {
	displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void
	clearLastInfoMessage: () => void
}

export interface AuthView extends View {
	updateUserInfo: (
		user: User,
		user2: User,
		authToken: AuthToken,
		rememberMe: boolean
	) => void
}

export class Presenter<V extends View> {
	private _view: V;
	private navigate: NavigateFunction = useNavigate();

	protected constructor(view: V) {
		this._view = view;
	}

	protected get view(): V {
		return this._view;
	}

	protected async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string): Promise<void> {
		try {
			await operation();
		} catch (error) {
			this.view.displayErrorMessage(
			`Failed to ${operationDescription} because of exception: ${error}`
			);
		}
	};

	protected async authenticate(authFunc: () => Promise<[User, AuthToken]>, rememberMe: boolean, view: AuthView): Promise<void> {
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