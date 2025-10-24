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
  presenter?: LoginPresenter
}

const Login = (props: Props) => {
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const [isLoading, setIsLoading] = useState(false);
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const checkButtonDisabled = () => {
    return alias === "" || password === "";
  };

  const observer: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigateToPath: (path) => navigate(path),
    setIsLoading: setIsLoading,
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenter  ?? new LoginPresenter(observer, props.originalUrl);
  }

  const handleAliasChange = (value: string) => {
    setAlias(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleRememberMeChange = (value: boolean) => {
    setRememberMe(value);
  };

  const handleLogin = () => {
    presenterRef.current!.doLogin(alias, password, rememberMe);
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkButtonDisabled()) {
      handleLogin();
    }
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        handleRegisterOrLogin={loginOnEnter}
        setAlias={handleAliasChange}
        setPassword={handlePasswordChange}
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
      setRememberMe={handleRememberMeChange}
      submitButtonDisabled={checkButtonDisabled}
      isLoading={()=>isLoading}
      submit={handleLogin}
    />
  );
};

export default Login;
