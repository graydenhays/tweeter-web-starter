import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface FollowerCountView {
	setFollowerCount: (value: React.SetStateAction<number>) => void
	displayErrorMessage: (message: string) => void
}

export class FollowerCountPresenter {

	private view: FollowerCountView;
	private followService: FollowService;

	public constructor(view: FollowerCountView) {
		this.view = view
		this.followService = new FollowService();
	}

	public async setNumbFollowers(
		authToken: AuthToken,
		displayedUser: User
	) {
		try {
		this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
		} catch (error) {
		this.view.displayErrorMessage(
			`Failed to get followes count because of exception: ${error}`
		);
		}
	};
}