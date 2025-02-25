import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";

export interface RegisterView extends View {
	updateUserInfo: (
		user: User,
		user2: User,
		authToken: AuthToken,
		rememberMe: boolean
	) => void
	setImageUrl: React.Dispatch<React.SetStateAction<string>>
	setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>
	setImageFileExtension: React.Dispatch<React.SetStateAction<string>>
}

export class RegisterPresenter extends Presenter {
	private userService: UserService;
	private navigate: NavigateFunction = useNavigate();

	public constructor(view: RegisterView) {
		super(view);
		this.userService = new UserService();
	}

	protected get view(): RegisterView {
		return super.view as RegisterView;
	}

	public async doRegister(
		alias: string,
		password: string,
		rememberMe: boolean,
		firstName: string,
		lastName: string,
		imageBytes: Uint8Array,
		imageFileExtension: string
	) {
		this.doFailureReportingOperation(async () => {
			const [user, authToken] = await this.userService.register(
				firstName,
				lastName,
				alias,
				password,
				imageBytes,
				imageFileExtension
			);

			this.view.updateUserInfo(user, user, authToken, rememberMe);
			this.navigate("/");
		}, "register user");
	};

	public handleImageFile (file: File | undefined) {
		if (file) {
		  this.view.setImageUrl(URL.createObjectURL(file));

		  const reader = new FileReader();
		  reader.onload = (event: ProgressEvent<FileReader>) => {
			const imageStringBase64 = event.target?.result as string;

			// Remove unnecessary file metadata from the start of the string.
			const imageStringBase64BufferContents =
			  imageStringBase64.split("base64,")[1];

			const bytes: Uint8Array = Buffer.from(
			  imageStringBase64BufferContents,
			  "base64"
			);

			this.view.setImageBytes(bytes);
		  };
		  reader.readAsDataURL(file);

		  // Set image file extension (and move to a separate method)
		  const fileExtension = this.getFileExtension(file);
		  if (fileExtension) {
			this.view.setImageFileExtension(fileExtension);
		  }
		} else {
		  this.view.setImageUrl("");
		  this.view.setImageBytes(new Uint8Array());
		}
	};

	public getFileExtension (file: File): string | undefined {
		return file.name.split(".").pop();
	};
}