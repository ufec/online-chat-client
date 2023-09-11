import {
  type MsgTypeEnum,
  type BaseDto,
  type MsgIsApplyEnum,
  type MsgIsReplyEnum,
  type MsgStatusEnum,
  type MsgFromTypeEnum,
} from '@/common/interface';
import { type PublicUserInfoDto } from './user.dto';
import { type AttachmentResultDto } from './attachments.dto';
import { type PaginatedDto, type ResultDto } from './result.dto';

export interface MessageDto extends BaseDto {
  id: string;
  channelId: string;
  authorId: number;
  content: string;
  msgType: MsgTypeEnum;
  msgStatus: MsgStatusEnum;
  msgFromType: MsgFromTypeEnum;
  isApply: MsgIsApplyEnum;
  isReply: MsgIsReplyEnum;
  mentionEveryone: number;
  messageReferenceId: string;
  author?: PublicUserInfoDto;
  mentions?: PublicUserInfoDto[];
  attachments: AttachmentResultDto[];
}

export type MessagePagenationDto = ResultDto<PaginatedDto<MessageDto>>;
export interface CreateMessageDto {
  channelId: string;
  content: string;
  msgType: MsgTypeEnum;
  msgStatus: MsgStatusEnum;
  msgFromType: MsgFromTypeEnum;
  isApply?: MsgIsApplyEnum;
  isReply?: MsgIsReplyEnum;
  mentionIds?: number[];
  mentionEveryone?: boolean;
  attachmentIds?: string;
  messageReferenceId?: string;
  attachments?: AttachmentResultDto[];
}

export type MessageResultDto = ResultDto<MessageDto>;

export type QueryMessagesByChannelIds = ResultDto<Record<string, MessageDto[]>>;
