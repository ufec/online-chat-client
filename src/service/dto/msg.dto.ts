import type { MsgFromTypeEnum, MsgStatusEnum, MsgTypeEnum } from '@/common/interface';
import type { PaginatedDto, ResultDto } from './result.dto';
import type { PublicUserInfoDto } from './user.dto';

export interface GetMsgListBodyDTO {
  fromUserId: number;
  toUserId: number;
  page: number;
  pageSize: number;
}

export type GetMsgListResultDTO = ResultDto<
  PaginatedDto<{
    msgId: string;
    fromUserId: number;
    toUserId: number;
    message: string;
    msgType: MsgTypeEnum;
    status: MsgStatusEnum;
    msgFromType: MsgFromTypeEnum;
    createdAt: string;
    isApply: number; // 是否是好友申请消息
    isReply: number; // 是否是回复消息
    fromUser: PublicUserInfoDto;
  }>
>;
