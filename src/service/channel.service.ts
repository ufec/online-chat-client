import { request } from '@/utils/request';
import { channel } from './api';
import { type PageQueryDto } from '@/common/interface';
import {
  type CreateGroupDto,
  type ChannelMemberPagenatedResultDto,
  type CreateGroupResultDto,
} from './dto/channel.dto';

export async function getMyChannels(page = 1, pageSize = 10) {
  return await request.get<ChannelMemberPagenatedResultDto, PageQueryDto>({
    url: channel.getMyChannelsApi,
    params: {
      page,
      pageSize,
    },
  });
}

export async function createGroup(payload: CreateGroupDto) {
  return await request.post<CreateGroupResultDto, CreateGroupDto>({
    url: channel.createGroupApi,
    data: payload,
  });
}
