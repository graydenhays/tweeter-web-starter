// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.

// Domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment } from "./model/domain/PostSegment";
export { Type } from "./model/dto/PostSegmentDto"
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// DTOs
export type { UserDto } from "./model/dto/UserDto"
export type { StatusDto } from "./model/dto/StatusDto"
export type { PostSegmentDto } from "./model/dto/PostSegmentDto"

// Requests
export type { TweeterRequest } from "./model/net/request/TweeterRequest"
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest"
export type { GetUserRequest } from "./model/net/request/GetUserRequest"
export type { RegisterRequest } from "./model/net/request/RegisterRequest"
export type { AuthRequest } from "./model/net/request/AuthRequest"
export type { FollowRequest } from "./model/net/request/FollowRequest"
export type { IsFollowerRequest } from "./model/net/request/IsFollowerRequest"
export type { PagedStatusItemRequest } from "./model/net/request/PagedStatusItemRequest"
export type { PostStatusRequest } from "./model/net/request/PostStatusRequest"

//Responses
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse"
export type { GetUserResponse } from "./model/net/response/GetUserResponse"
export type { TweeterResponse } from "./model/net/response/TweeterResponse"
export type { AuthResponse } from "./model/net/response/AuthResponse"
export type { FollowResponse } from "./model/net/response/FollowResponse"
export type { FollowCountResponse } from "./model/net/response/FollowCountResponse"
export type { IsFollowerResponse } from "./model/net/response/IsFollowerResponse"
export type { PagedStatusItemResponse } from "./model/net/response/PagedStatusItemResponse"

// Other

export { FakeData } from "./util/FakeData";