import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DisplayedUserPresenter, DisplayedUserView } from "./DisplayUserPresenter";

export class FollowDisplayedUserPresenter extends DisplayedUserPresenter{
	private followService: FollowService;

	public constructor(view: DisplayedUserView) {
		super(view);
		this.followService = new FollowService();
	}

	public async updateDisplayedUser(
		event: React.MouseEvent,
		authToken: AuthToken,
		displayedUser: User | null
	): Promise<void> {
		event.preventDefault();

		try {
		  this.view.setIsLoading(true);
		  this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

		  const [followerCount, followeeCount] = await this.followService.follow(
			authToken!,
			displayedUser!
		  );

		  this.view.setIsFollower(true);
		  this.view.setFollowerCount(followerCount);
		  this.view.setFolloweeCount(followeeCount);
		} catch (error) {
		  this.view.displayErrorMessage(
			`Failed to follow user because of exception: ${error}`
		  );
		} finally {
		  this.view.clearLastInfoMessage();
		  this.view.setIsLoading(false);
		}
	};
}