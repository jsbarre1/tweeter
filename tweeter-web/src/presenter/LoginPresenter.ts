import { User, AuthToken, FakeData } from "tweeter-shared";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigateToPath: (path: string) => void;
  setIsLoading: (isLoading:boolean) => void
}
export class LoginPresenter {
  private _alias = "";
  private _password = "";
  private _rememberMe = false;
  private view: LoginView;
  private originalUrl: string | undefined = "";
  public constructor(view: LoginView, originalUrl: string | undefined) {
    this.view = view;
    this.originalUrl = originalUrl;
  }

  public checkSubmitButtonStatus = (): boolean => {
    return !this._alias || !this._password;
  };

  public setAlias(value: string) {
    this._alias = value;
  }
  public setPassword(value: string) {
    this._password = value;
  }
  public setRememberMe(value: boolean) {
    this._rememberMe = value;
  }

  public async doLogin() {
    try {
      this.view.setIsLoading(true)

      const [user, authToken] = await this.login(this._alias, this._password);

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
      this.view.setIsLoading(false)
    }
  }

  public login = async (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> => {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };
}
