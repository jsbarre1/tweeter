import { AuthToken, User, FakeData } from "tweeter-shared";

/**
 * Server-side UserService
 * For Milestone 3, returns dummy data from FakeData
 * For Milestone 4, will be updated to use DAOs for database access
 */
export class UserService {
  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    // TODO: Milestone 4 - Validate credentials against database
    // For now, accept any credentials and return fake data
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ): Promise<[User, AuthToken]> {
    // TODO: Milestone 4 - Store user in database and upload image to S3
    // For now, return fake data
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // TODO: Milestone 4 - Invalidate auth token in database
    // For now, just return (no-op)
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    // TODO: Milestone 4 - Validate auth token and fetch user from database
    return FakeData.instance.findUserByAlias(alias);
  }
}
