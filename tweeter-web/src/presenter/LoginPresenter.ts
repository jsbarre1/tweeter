import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
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
export class LoginPresenter extends Presenter<LoginView>{
  private _alias = "";
  private _password = "";
  private _rememberMe = false;
  private userService;
  private originalUrl: string | undefined = "";
  public constructor(view: LoginView, originalUrl: string | undefined) {
    super(view);
    this.originalUrl = originalUrl;
    this.userService = new UserService();
  }

  public checkSubmitButtonStatus = (): boolean => {
    return this._alias === "" || this._password === "";
  };

  public setAlias = (value: string) => {
    this._alias = value;
    this.updateButtonStatus(this.checkSubmitButtonStatus, this.view);
  }
  public setPassword = (value: string) => {
    this._password = value;
    this.updateButtonStatus(this.checkSubmitButtonStatus, this.view);
  }
  public setRememberMe = (value: boolean) => {
    this._rememberMe = value;
  }

  public doLogin = async () => {
    this.view.setIsLoading(true);

    let user: User;
    let authToken: AuthToken;

    await this.doAuthenticationOperation(
      async () => {
        [user, authToken] = await this.userService.login(this._alias, this._password);
        this.view.updateUserInfo(user, user, authToken, this._rememberMe);
      },
      () => {
        if (this.originalUrl) {
          this.view.navigateToPath(this.originalUrl);
        } else {
          this.view.navigateToPath(`/feed/${user.alias}`);
        }
      },
      "log user in"
    );

    this.view.setIsLoading(false);
  }

}
