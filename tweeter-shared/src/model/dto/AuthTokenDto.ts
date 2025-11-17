import { AuthToken } from "../domain/AuthToken";


export interface AuthTokenDto {
  token: string;
  timestamp: number;
}

export class AuthTokenDto {
  static fromAuthToken(authToken: AuthToken): AuthTokenDto {
    return {
      token: authToken.token,
      timestamp: authToken.timestamp,
    };
  }

  static toAuthToken(dto: AuthTokenDto): AuthToken {
    return new AuthToken(dto.token, dto.timestamp);
  }
}
