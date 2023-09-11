import { request } from '@/utils/request';
import { friend } from './api';
import type { FriendResultDto, GetFriendListQueryDto } from './dto/friend.dto';
import type {
  AcceptFriendRequestDto,
  FriendRequestsDto,
  FriendRequestsResultDto,
} from './dto/user.dto';
import { type ResultDto } from './dto/result.dto';

/**
 * 发起好友请求
 * @param friendDto
 * @returns
 */
export async function sendFriendRequest(friendDto: FriendRequestsDto) {
  return await request.post<FriendRequestsResultDto, FriendRequestsDto>({
    url: friend.sendApi,
    data: friendDto,
  });
}

/**
 * 接受好友请求
 * @param acceptBody
 */
export async function acceptFriendRequest(acceptBody: AcceptFriendRequestDto) {
  return await request.post<ResultDto, AcceptFriendRequestDto>({
    url: friend.acceptApi,
    data: acceptBody,
  });
}

/**
 * 拒绝好友请求
 * @param friendRequestId
 * @returns
 */
export async function rejectFriendRequest(friendRequestId: number) {
  return await request.post<ResultDto, { friendRequestId: number }>({
    url: friend.rejectApi,
    data: { friendRequestId },
  });
}

/**
 * 获取好友列表
 * @returns
 * @param query
 */
export async function getFriendList(query?: GetFriendListQueryDto) {
  return await request.get<FriendResultDto, GetFriendListQueryDto>({
    url: friend.getFriendListApi,
    params: { ...query, page: query?.page ?? 1, pageSize: query?.pageSize ?? 10 },
  });
}

/**
 * 删除好友
 * @param friendId 好友id
 * @returns
 */
export async function deleteFriend(friendId: number) {
  return await request.post<ResultDto, { friendId: number }>({
    url: friend.deleteFriendApi,
    data: { friendId },
  });
}
