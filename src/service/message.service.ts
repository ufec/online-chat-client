import { request } from '@/utils/request';
import { message } from './api';
import type {
  CreateMessageDto,
  MessagePagenationDto,
  MessageResultDto,
  QueryMessagesByChannelIds,
} from './dto/message.dto';

/**
 * 查询频道消息
 * @param page 页码
 * @param pageSize 每页数量
 * @param channelId 频道id
 * @returns 消息列表
 */
export async function queryChannelMessage(page = 1, pageSize = 50, channelId: string) {
  return await request.get<MessagePagenationDto>(
    {
      url: message.queryChannelMessageApi,
      params: {
        page,
        pageSize,
      },
    },
    {
      restfulParams: {
        channelId,
      },
    }
  );
}

/**
 * 发送消息
 * @param body
 * @returns
 */
export async function sendMessage(body: CreateMessageDto) {
  return await request.post<MessageResultDto, CreateMessageDto>(
    {
      url: message.queryChannelMessageApi,
      data: body,
    },
    {
      restfulParams: {
        channelId: body.channelId,
      },
    }
  );
}

export async function queryMessagesByChannelIds(channelIds: string[]) {
  return await request.post<QueryMessagesByChannelIds, unknown>({
    url: message.queryMessagesByChannelIdsApi,
    data: {
      channelIds,
    },
  });
}

/**
 * 创建附件消息
 * @param formData 附件
 * @param channelId 频道id
 */
export async function createAttachmentMessage(formData: FormData, channelId: string) {
  return await request.post<MessageResultDto, unknown>(
    {
      url: message.createAttachmentMessageApi,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    },
    {
      restfulParams: {
        channelId,
      },
    }
  );
}
