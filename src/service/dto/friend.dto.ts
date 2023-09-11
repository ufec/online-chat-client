import { type FriendRequestsTypeEnum } from '@/common/constants';
import { type PaginatedDto, type ResultDto } from './result.dto';
import { type PublicUserInfoDto } from './user.dto';

export interface FriendRequestsRecordDto {
  id: number;
  fromUserId: number;
  status: number;
  type: FriendRequestsTypeEnum;
  extra: string;
  remark: string;
  groupId: number;
  fromUser: PublicUserInfoDto;
}

export type FriendRequestsRecordListDto = FriendRequestsRecordDto[];

export interface GetFriendListQueryDto {
  page?: number;
  pageSize?: number;
}

export interface FriendDto {
  friendInfo: PublicUserInfoDto;
  channelId: string;
  remark: string;
  groupId: number;
  createdAt: string;
}

export type FriendResultDto = ResultDto<PaginatedDto<FriendDto>>;
