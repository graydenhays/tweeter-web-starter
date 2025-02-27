import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
	setIsLoading: (value: React.SetStateAction<boolean>) => void
	setPost: React.Dispatch<React.SetStateAction<string>>
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
	private _statusService: StatusService;

	public constructor(view: PostStatusView) {
		super(view);
		this._statusService = new StatusService();
	}

	public get statusService() {
		return this._statusService;
	}

	public async submitPost (
		event: React.MouseEvent,
		authToken: AuthToken | null,
		currentUser: User | null,
		post: string
	) {
		event.preventDefault();
		this.doFailureReportingOperation(async () => {
			this.view.setIsLoading(true);
			this.view.displayInfoMessage("Posting status...", 0);

			const status = new Status(post, currentUser!, Date.now());

			await this.statusService.postStatus(authToken!, status);

			this.view.setPost("");
			this.view.displayInfoMessage("Status posted!", 2000);
		}, "post the status");
		this.view.clearLastInfoMessage();
		this.view.setIsLoading(false);
	};
}