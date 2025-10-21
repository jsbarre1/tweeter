import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";


export interface NavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigateToPath: (path: string) => void;
}

export class NavigationPresenter extends Presenter<NavigationView> {
  private userService: UserService;

  constructor(view: NavigationView) {
    super(view);
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