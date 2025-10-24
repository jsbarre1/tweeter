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
}
export class LoginPresenter extends Presenter<LoginView>{
  private userService;
  private originalUrl: string | undefined = "";
  public constructor(view: LoginView, originalUrl: string | undefined) {
    super(view);
    this.originalUrl = originalUrl;
    this.userService = new UserService();
  }

  public doLogin = async (alias: string, password: string, rememberMe: boolean) => {
    let user: User;
    let authToken: AuthToken;

    await this.doAuthenticationOperation(
      async () => {
        [user, authToken] = await this.userService.login(alias, password);
        this.view.updateUserInfo(user, user, authToken, rememberMe);
      },
      () => {
        if (this.originalUrl) {
          this.view.navigateToPath(this.originalUrl);
        } else {
          this.view.navigateToPath(`/feed/${user.alias}`);
        }
      },
      "log user in",
      this.view
    );
  }

}
