import { AuthToken, User, FakeData } from "tweeter-shared";


export class UserService {
  public async login(alias: string, password: string): Promise<[User, AuthToken]> {

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

    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
 
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    // TODO: Milestone 4 - Validate auth token and fetch user from database
    return FakeData.instance.findUserByAlias(alias);
  }
}
