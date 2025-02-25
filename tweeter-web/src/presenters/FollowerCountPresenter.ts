import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, View } from "./Presenter";

export interface FollowerCountView extends View {
	setFollowerCount: (value: React.SetStateAction<number>) => void
}

export class FollowerCountPresenter extends Presenter<FollowerCountView> {

	private followService: FollowService;

	public constructor(view: FollowerCountView) {
		super(view);
		this.followService = new FollowService();
	}

	public async setNumbFollowers(
		authToken: AuthToken,
		displayedUser: User
	) {
		this.doFailureReportingOperation(async () => {
			this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
		}, "get followers");
	};
}