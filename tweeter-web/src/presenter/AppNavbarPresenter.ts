import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AppNavbarView {
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigateToPath: (path: string) => void;
}

export class AppNavbarPresenter {
  private userService: UserService;
  private view: AppNavbarView;

  constructor(view: AppNavbarView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    await this.userService.logout(authToken)

    try {
      await this.userService.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigateToPath("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
