import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface NavigationView {
  setDisplayedUser: (user: User) => void;
  navigateToPath: (path: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class NavigationPresenter {
  private userService: UserService;
  private view: NavigationView;
  
  constructor(view: NavigationView) {
    this.view = view;
    this.userService = new UserService();
  }
  
  public async navigateToUser(
    authToken: AuthToken,
    currentUser: User,
    alias: string,
    featurePath: string
  ): Promise<void> {
    try {
      const user = await this.userService.getUser(authToken, alias);
      if (user) {
        if (!user.equals(currentUser)) {
          this.view.setDisplayedUser(user);
          this.view.navigateToPath(`${featurePath}/${user.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
}