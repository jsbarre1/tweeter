import { Status, AuthToken } from "tweeter-shared";
import { Service } from "./Serivce";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await this.serverFacade.getMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await this.serverFacade.getMoreFeedItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.serverFacade.postStatus(authToken, newStatus);
  }
}