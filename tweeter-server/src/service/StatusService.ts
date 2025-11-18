import { Status, FakeData, AuthToken } from "tweeter-shared";

/**
 * Server-side StatusService
 * For Milestone 3, returns dummy data from FakeData
 * For Milestone 4, will be updated to use DAOs for database access
 */
export class StatusService {
  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Milestone 4 - Validate auth token and fetch from database
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Milestone 4 - Validate auth token and fetch from database
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    // TODO: Milestone 4 - Validate auth token and store status in database
    // For now, just return (no-op)
  }
}
