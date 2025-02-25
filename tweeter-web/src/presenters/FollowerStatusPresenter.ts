import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { Presenter, View } from "./Presenter";

export interface FollowerStatusView extends View {
	setIsFollower: (value: React.SetStateAction<boolean>) => void
}

export class FollowerStatusPresenter extends Presenter {
	private followService: FollowService;

	public constructor(view: FollowerStatusView) {
		super(view)
		this.followService = new FollowService();
	}

	protected get view(): FollowerStatusView {
		return super.view as FollowerStatusView;
	}

	public async setIsFollowerStatus(
		authToken: AuthToken,
		currentUser: User,
		displayedUser: User
	  ) {
		this.doFailureReportingOperation(async () => {
			if (currentUser === displayedUser) {
				this.view.setIsFollower(false);
			} else {
				this.view.setIsFollower(
					await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
				);
			}
		}, "determine follower status");
	};


}