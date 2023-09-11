import { type ChannelDto, type ChannelMemberDto } from '@/common/interface';
import { type ResultDto, type PaginatedDto } from './result.dto';

export type ChannelMemberPagenatedResultDto = ResultDto<PaginatedDto<ChannelMemberDto>>;

export interface CreateGroupDto {
  groupName?: string;
  avatar?: string;
  memberIds: number[];
}

interface CreateGroupResultData extends ChannelDto {
  channelMembers: ChannelMemberDto[];
}

export type CreateGroupResultDto = ResultDto<CreateGroupResultData>;
