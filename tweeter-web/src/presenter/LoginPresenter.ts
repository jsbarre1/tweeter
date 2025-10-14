import { User, AuthToken, FakeData } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigateToPath: (path: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsButtonDisabled: (isDisabled: boolean) => void;

}
export class LoginPresenter {
  private _alias = "";
  private _password = "";
  private _rememberMe = false;
  private view: LoginView;
  private userService;
  private originalUrl: string | undefined = "";
  public constructor(view: LoginView, originalUrl: string | undefined) {
    this.view = view;
    this.originalUrl = originalUrl;
    this.userService = new UserService();
    
  }

  private updateButtonStatus(): void {
    const isDisabled = this._alias === "" || this._password === "";
    this.view.setIsButtonDisabled(isDisabled);
  }

  public checkSubmitButtonStatus = (): boolean => {
    return this._alias === "" || this._password === "";
  };

  public setAlias = (value: string) => {
    this._alias = value;
    this.updateButtonStatus();
  }
  public setPassword = (value: string) => {
    this._password = value;
    this.updateButtonStatus();
  }
  public setRememberMe = (value: boolean) => {
    this._rememberMe = value;
  }

  public doLogin = async () => {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(this._alias,this._password)

      this.view.updateUserInfo(user, user, authToken, this._rememberMe);

      if (this.originalUrl) {
        this.view.navigateToPath(this.originalUrl);
      } else {
        this.view.navigateToPath(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

}
