import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, View } from "./Presenter";

export interface FolloweeCountView extends View {
	setFolloweeCount: (value: React.SetStateAction<number>) => void
}

export class FolloweeCountPresenter extends Presenter<FolloweeCountView> {

	private followService: FollowService;

	public constructor(view: FolloweeCountView) {
		super(view);
		this.followService = new FollowService();
	}

	public async setNumbFollowees(
		authToken: AuthToken,
		displayedUser: User
	) {
		this.doFailureReportingOperation(async () => {
			this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
		}, "get followees");
	};
}