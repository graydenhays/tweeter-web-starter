import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface FolloweeCountView {
	setFolloweeCount: (value: React.SetStateAction<number>) => void
	displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}

export class FolloweeCountPresenter {

	private view: FolloweeCountView;
	private followService: FollowService;

	public constructor(view: FolloweeCountView) {
		this.view = view
		this.followService = new FollowService();
	}

	public async setNumbFollowees(
		authToken: AuthToken,
		displayedUser: User
	) {
		try {
		this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
		} catch (error) {
		this.view.displayErrorMessage(
			`Failed to get followees count because of exception: ${error}`
		);
		}
	};
}