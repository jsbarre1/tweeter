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
    let user: User | null;

    await this.doAuthenticationOperation(
      async () => {
        user = await this.userService.getUser(authToken, alias);
      },
      () => {
        if (user && !user.equals(currentUser)) {
          this.view.setDisplayedUser(user);
          this.view.navigateToPath(`${featurePath}/${user.alias}`);
        }
      },
      "get user"
    );
  }
}