import { User } from "../domain/User";


export interface UserDto {
  firstName: string;
  lastName: string;
  alias: string;
  imageUrl: string;
}

export class UserDto {
  static fromUser(user: User): UserDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl,
    };
  }

  static toUser(dto: UserDto): User {
    return new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl);
  }
}
