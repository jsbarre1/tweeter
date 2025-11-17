// Domain models
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// DTOs
export { UserDto } from "./model/dto/UserDto";
export { AuthTokenDto } from "./model/dto/AuthTokenDto";
export { StatusDto } from "./model/dto/StatusDto";

// Base request/response
export type { TweeterRequest } from "./model/net/request/TweeterRequest";
export type { TweeterResponse } from "./model/net/response/TweeterResponse";

// User requests/responses
export type { LoginRequest } from "./model/net/request/LoginRequest";
export type { LoginResponse } from "./model/net/response/LoginResponse";
export type { RegisterRequest } from "./model/net/request/RegisterRequest";
export type { RegisterResponse } from "./model/net/response/RegisterResponse";
export type { LogoutRequest } from "./model/net/request/LogoutRequest";
export type { LogoutResponse } from "./model/net/response/LogoutResponse";
export type { GetUserRequest } from "./model/net/request/GetUserRequest";
export type { GetUserResponse } from "./model/net/response/GetUserResponse";

// Follow requests/responses
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { FollowRequest } from "./model/net/request/FollowRequest";
export type { FollowResponse } from "./model/net/response/FollowResponse";
export type { UnfollowRequest } from "./model/net/request/UnfollowRequest";
export type { UnfollowResponse } from "./model/net/response/UnfollowResponse";
export type { GetIsFollowerStatusRequest } from "./model/net/request/GetIsFollowerStatusRequest";
export type { GetIsFollowerStatusResponse } from "./model/net/response/GetIsFollowerStatusResponse";
export type { GetFollowCountRequest } from "./model/net/request/GetFollowCountRequest";
export type { GetFollowCountResponse } from "./model/net/response/GetFollowCountResponse";

// Status requests/responses
export type { PagedStatusItemRequest } from "./model/net/request/PagedStatusItemRequest";
export type { PagedStatusItemResponse } from "./model/net/response/PagedStatusItemResponse";
export type { PostStatusRequest } from "./model/net/request/PostStatusRequest";
export type { PostStatusResponse } from "./model/net/response/PostStatusResponse";

// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";
