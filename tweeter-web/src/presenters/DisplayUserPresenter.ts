import { AuthToken, User } from "tweeter-shared"

export interface DisplayedUserView {
	setIsLoading: (value: React.SetStateAction<boolean>) => void
	displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void
	setIsFollower: (value: React.SetStateAction<boolean>) => void
	setFollowerCount: (value: React.SetStateAction<number>) => void
	setFolloweeCount: (value: React.SetStateAction<number>) => void
	displayErrorMessage: (message: string, bootstrapClasses?: string) => void
	clearLastInfoMessage: () => void
}

export abstract class DisplayedUserPresenter {
	private _view: DisplayedUserView;

	public constructor(view: DisplayedUserView) {
		this._view = view;
	}

	protected get view() {
		return this._view
	}

	public abstract updateDisplayedUser(
			event: React.MouseEvent,
			authToken: AuthToken,
			displayedUser: User | null
		): Promise<void>
}