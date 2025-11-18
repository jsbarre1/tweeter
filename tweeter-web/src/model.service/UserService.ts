import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Serivce";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.serverFacade.getUser(authToken, alias);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this.serverFacade.logout(authToken);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return await this.serverFacade.login(alias, password);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return await this.serverFacade.register(
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64
    );
  }
}
