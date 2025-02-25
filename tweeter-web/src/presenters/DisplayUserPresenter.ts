import { AuthToken, User } from "tweeter-shared"
import { MessageView, Presenter } from "./Presenter"

export interface DisplayedUserView extends MessageView {
	setIsLoading: (value: React.SetStateAction<boolean>) => void
	setIsFollower: (value: React.SetStateAction<boolean>) => void
	setFollowerCount: (value: React.SetStateAction<number>) => void
	setFolloweeCount: (value: React.SetStateAction<number>) => void
}

export abstract class DisplayedUserPresenter extends Presenter<DisplayedUserView> {

	public constructor(view: DisplayedUserView) {
		super(view);
	}

	public abstract updateDisplayedUser(
			event: React.MouseEvent,
			authToken: AuthToken,
			displayedUser: User | null
		): Promise<void>
}