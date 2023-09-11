import { request } from '@/utils/request';
import { message } from './api';
import type { GetMsgListBodyDTO, GetMsgListResultDTO } from './dto/msg.dto';

/**
 * 获取好友之间的消息列表
 * @param getMsgListBody
 * @returns
 */
export async function getMsgList(getMsgListBody: GetMsgListBodyDTO) {
  return await request.post<GetMsgListResultDTO, GetMsgListBodyDTO>({
    url: message.getMsgListApi,
    data: getMsgListBody,
  });
}
