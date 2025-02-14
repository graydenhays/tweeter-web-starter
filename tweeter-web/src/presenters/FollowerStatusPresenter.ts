import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface FollowerStatusView {
	setIsFollower: (value: React.SetStateAction<boolean>) => void
	displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}

export class FollowerStatusPresenter {
	private view: FollowerStatusView;
	private followService: FollowService;

	public constructor(view: FollowerStatusView) {
		this.view = view;
		this.followService = new FollowService();
	}

	public async setIsFollowerStatus(
		authToken: AuthToken,
		currentUser: User,
		displayedUser: User
	  ) {
		try {
		  if (currentUser === displayedUser) {
			this.view.setIsFollower(false);
		  } else {
			this.view.setIsFollower(
			  await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
			);
		  }
		} catch (error) {
		  this.view.displayErrorMessage(
			`Failed to determine follower status because of exception: ${error}`
		  );
		}
	};


}