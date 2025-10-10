import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import {
  RegisterPresenter,
  RegisterView,
} from "../../../presenter/RegisterPresenter";

const Register = () => {
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>("");

  const observer: RegisterView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigateToPath: (path) => navigate(path),
    setIsLoading: setIsLoading,
    setIsButtonDisabled: setIsButtonDisabled,
    setImageUrl: setImageUrl,
  };

  const presenterRef = useRef<RegisterPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new RegisterPresenter(observer);
  }

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.key == "Enter" &&
      !presenterRef.current!.checkSubmitButtonStatus()
    ) {
      presenterRef.current!.doRegister();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    presenterRef.current!.handleImageFile(file);
  };

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) =>
              presenterRef.current!.setFirstName(event.target.value)
            }
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => presenterRef.current!.setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields
          handleRegisterOrLogin={registerOnEnter}
          setAlias={presenterRef.current!.setAlias}
          setPassword={presenterRef.current!.setPassword}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img
                src={imageUrl}
                className="img-thumbnail"
                alt=""
              ></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={presenterRef.current!.setRememberMe}
      submitButtonDisabled={isButtonDisabled}
      isLoading={isLoading}
      submit={presenterRef.current!.doRegister}
    />
  );
};

export default Register;
