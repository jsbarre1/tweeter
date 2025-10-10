import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";

import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";
import { useRef, useState } from "react";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const observer: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigateToPath: (path) => navigate(path),
    setIsLoading: setIsLoading,
    setIsButtonDisabled: setIsButtonDisabled,
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(observer, props.originalUrl);
  }

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !presenterRef.current!.checkSubmitButtonStatus()) {
      presenterRef.current!.doLogin();
    }
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        handleRegisterOrLogin={loginOnEnter}
        setAlias={presenterRef.current!.setAlias}
        setPassword={presenterRef.current!.setPassword}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
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
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={presenterRef.current!.setRememberMe}
      submitButtonDisabled={isButtonDisabled}
      isLoading={isLoading}
      submit={presenterRef.current!.doLogin}
    />
  );
};

export default Login;
