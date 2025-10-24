import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ): Promise<void> {
    await this.doFollowUnfollowOperation(
      async () => {
        const status = new Status(post, currentUser, Date.now());
        await this.statusService.postStatus(authToken, status);
      },
      () => {
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "Posting status...",
      this.view
    );
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ): boolean {
    return !post.trim() || !authToken || !currentUser;
  }
}
