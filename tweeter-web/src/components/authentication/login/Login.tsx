import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import userInfoHook from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { AuthView } from "../../../presenters/AuthPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
  presenterGenerator: (view: AuthView) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUserInfo } = userInfoHook();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const listener: AuthView = {
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
  }

  const [presenter] = useState(props.presenter ?? props.presenterGenerator(listener));

  const doLogin = () => {
    setIsLoading(true);
    presenter.doLogin(props.originalUrl, alias, password, rememberMe);
    setIsLoading(false);
  }

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          keyDown={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
