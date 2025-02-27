import { NavigateFunction, NavigateOptions, To, useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";

export interface View {
	displayErrorMessage: (message: string) => void
}

export interface MessageView extends View {
	displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void
	clearLastInfoMessage: () => void
}

export class Presenter<V extends View> {
	private _view: V;
	private _navigate: NavigateFunction = useNavigate();

	protected constructor(view: V) {
		this._view = view;
	}

	protected get view(): V {
		return this._view;
	}

	protected get navigate() {
		return this._navigate;
	}

	protected async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string): Promise<void> {
		try {
			await operation();
		} catch (error) {
			this.view.displayErrorMessage(
			`Failed to ${operationDescription} because of exception: ${error}`
			);
		}
	};


}