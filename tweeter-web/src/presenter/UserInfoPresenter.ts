import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      if (currentUser.equals(displayedUser)) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.followService.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
        this.view.setIsFollower(isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const count = await this.followService.getFolloweeCount(
        authToken,
        displayedUser
      );
      this.view.setFolloweeCount(count);
    }, "get followees count");
  }

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const count = await this.followService.getFollowerCount(
        authToken,
        displayedUser
      );
      this.view.setFollowerCount(count);
    }, "get followers count");
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    let followerCount: number;
    let followeeCount: number;

    await this.doFollowUnfollowOperation(
      async () => {
        [followerCount, followeeCount] = await this.followService.follow(
          authToken,
          displayedUser
        );
      },
      () => {
        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      `Following ${displayedUser.name}...`,
      this.view
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    let followerCount: number;
    let followeeCount: number;

    await this.doFollowUnfollowOperation(
      async () => {
        [followerCount, followeeCount] = await this.followService.unfollow(
          authToken,
          displayedUser
        );
      },
      () => {
        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      `Unfollowing ${displayedUser.name}...`,
      this.view
    );
  }
}
