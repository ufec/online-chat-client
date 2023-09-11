import type { PublicUserInfoDto } from '@/service/dto/user.dto';
import type { NavigationGuard, NavigationHookAfter } from 'vue-router';

export interface OnlineChatToken {
  accessToken: string;
  refreshToken: string;
}

export interface MessageItem {
  msgId: number;
  userId: number;
  nickName: string;
  avatar: string;
  message: string;
}

export interface RouterGuards {
  beforeEach: NavigationGuard[];
  beforeResolve: NavigationGuard[];
  afterEach: NavigationHookAfter[];
}

// export interface BasicUserInfo {
//   id: number;
//   name?: string;
//   username?: string;
//   nickname?: string;
//   slogan?: string;
//   avatar?: string;
//   message?: string;
// }

export interface SelectedChat {
  id: number;
  name: string;
  avatar: string;
}

export enum MsgTypeEnum {
  TEXT = 1,
  IMAGE = 2,
  VOICE = 3,
  VIDEO = 4,
  FILE = 5,
  LOCATION = 6,
  CARD = 7,
  SHARE = 8,
  SYSTEM = 9,
  RECALL = 10,
  NOTICE = 11,
}

export enum MsgStatusEnum {
  UNREAD = 1,
  READ = 2,
  RECALL = 3,
  DELETE = 4,
  SEND = 5,
  RECEIVE = 6,
}

export enum MsgFromTypeEnum {
  USER = 0,
  GROUP = 1,
  SYSTEM = 1,
}

export enum MsgIsApplyEnum {
  NO = 0,
  YES = 1,
}

export enum MsgIsReplyEnum {
  NO = 0,
  YES = 1,
}

export enum ChannelType {
  FRIEND = 0,
  GROUP = 1,
}

export enum ChannelRole {
  MEMBER = 0,
  ADMIN = 1,
  OWNER = 2,
}

export interface BaseDto {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  version: number;
}

export interface PageQueryDto {
  page: number;
  pageSize: number;
}

export interface MsgDto extends BaseDto {
  content: any;
  fromUserId: number;
  toUserId: number;
  message: string;
  msgType: MsgTypeEnum;
  status: MsgStatusEnum;
  msgFromType: MsgFromTypeEnum;
  msgId: string;
  isApply: MsgIsApplyEnum; // 是否是申请消息
}

export interface ChatItem {
  userId: number;
  nickName: string;
  avatar: string;
  message: string;
  createdAt: string;
  status: MsgStatusEnum;
  isApply: MsgIsApplyEnum; // 是否是申请消息
}

export interface PongData {
  alive: boolean;
  time: number;
  action: 'refresh_token' | 'logout' | 'none';
}

export interface MsgItem {
  msgId: string;
  fromUserId: number;
  toUserId: number;
  message: string;
  msgType: MsgTypeEnum;
  status: MsgStatusEnum;
  msgFromType: MsgFromTypeEnum;
  createdAt: string;
  isApply: MsgIsApplyEnum;
  isReply: MsgIsReplyEnum;
  fromUser: PublicUserInfoDto;
}

interface AttachmentResult {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  fileUrl: string;
  messageId: string;
  width?: number | undefined;
  height?: number | undefined;
}

export interface MessageResult extends BaseDto {
  id: string;
  channelId: string;
  content: string;
  msgType: MsgTypeEnum;
  msgStatus: MsgStatusEnum;
  msgFromType: MsgFromTypeEnum;
  isApply: MsgIsApplyEnum;
  isReply: MsgIsReplyEnum;
  author: PublicUserInfoDto;
  mentions: PublicUserInfoDto[];
  attachments: AttachmentResult[] | unknown[];
}

export interface ChannelDto extends BaseDto {
  id: string;
  channelName: string;
  channelType: ChannelType;
  avatar: string;
  lastMessageId?: string; // 最后一条消息的id
}

export interface ChannelMemberDto extends BaseDto {
  channelId: string;
  memberId: number;
  role: ChannelRole;
  aliasChannelName: string;
  aliasMemberName: string;
  channel: ChannelDto;
  member: PublicUserInfoDto;
  channelType: ChannelType;
}

export interface ChannelCreateEvent {
  recipient: PublicUserInfoDto;
  lastMessageId?: string; // 最后一条消息的id
  channel: ChannelDto;
}
