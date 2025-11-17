import { Status } from "../domain/Status";
import { UserDto } from "./UserDto";


export interface StatusDto {
  post: string;
  user: UserDto;
  timestamp: number;
}

export class StatusDto {
  static fromStatus(status: Status): StatusDto {
    return {
      post: status.post,
      user: UserDto.fromUser(status.user),
      timestamp: status.timestamp,
    };
  }

  static toStatus(dto: StatusDto): Status {
    return new Status(
      dto.post,
      UserDto.toUser(dto.user),
      dto.timestamp
    );
  }
}
