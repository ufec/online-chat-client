import type { ResultDto } from './result.dto';

export interface UserLoginDto {
  username: string;
  password: string;
}

export interface PublicUserInfoDto {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  slogan: string;
  gender: number;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface UserLoginResultDto extends PublicUserInfoDto {
  token: Token;
}

export type UserLoginResult = ResultDto<UserLoginResultDto>;

export interface UserRegisterDto {
  username: string;
  password: string;
  nickname: string;
  slogan: string;
  gender: 0 | 1 | 2;
  avatar: string;
}

export interface UserRegisterResultDto {
  id?: number;
}

export type UserRegisterResult = ResultDto<UserRegisterResultDto>;

export interface SearchUserDto {
  username?: string;
  id?: number;
}

export type SearchUserResultDto = ResultDto<PublicUserInfoDto[]>;

export type GetUserInfoDto = ResultDto<PublicUserInfoDto>;

export interface FriendRequestsDto {
  toUserId: number;
  type: number;
  extra?: string;
  remark?: string;
}

export type FriendRequestsResultDto = ResultDto<{}>;

export interface AcceptFriendRequestDto {
  id: number;
  remark?: string;
}
