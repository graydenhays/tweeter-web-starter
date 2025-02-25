import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
	clearUserInfo: () => void
}

export class LogoutPresenter extends Presenter {
	private userService: UserService;

	public constructor(view: LogoutView) {
		super(view);
		this.userService = new UserService();
	}

	protected get view(): LogoutView {
		return super.view as LogoutView;
	}

	public async logOut(authToken: AuthToken | null) {
		this.view.displayInfoMessage("Logging Out...", 0);
		this.doFailureReportingOperation(async () => {
			await this.userService.logout(authToken!);
			this.view.clearLastInfoMessage();
			this.view.clearUserInfo();
		}, "log user out");
	};
}