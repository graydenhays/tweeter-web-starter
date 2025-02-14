import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import userInfoHook from "./UserInfoHook";

const useUserNavigationHook = () => {
	const { displayErrorMessage } = useToastListener();
  	const { setDisplayedUser, currentUser, authToken } = userInfoHook();


	const listener: UserNavigationView = {
		displayErrorMessage: displayErrorMessage,
		setDisplayedUser: setDisplayedUser
	}

	const presenter = new UserNavigationPresenter(listener);


	const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
		presenter.navigateToUser(event, authToken, currentUser);
	};

	return (
		{navigateToUser: navigateToUser}
	);
}

export default useUserNavigationHook;