import { defineStore } from 'pinia';
import type {
  FriendRequestsRecordListDto,
  FriendRequestsRecordDto,
} from '@/service/dto/friend.dto';
import { reactive } from 'vue';

export const useFriendRequestsMsgStore = defineStore(
  'friendRequestsMsg',
  () => {
    const friendRequestsMsg = reactive<FriendRequestsRecordDto[]>([]);
    const hashIndex = reactive<number[]>([]);

    function pushFriendRequestsMsg(list: FriendRequestsRecordListDto) {
      list.forEach((item) => {
        if (!hashIndex.includes(item.id)) {
          friendRequestsMsg.push(item);
          hashIndex.push(item.id);
        }
      });
    }

    function clearFriendRequestsMsg() {
      friendRequestsMsg.splice(0, friendRequestsMsg.length);
      hashIndex.splice(0, hashIndex.length);
    }

    function updateFriendRequestsMsgStatus(id: number, newValue: Partial<FriendRequestsRecordDto>) {
      const index = hashIndex.indexOf(id);
      if (index !== -1) {
        friendRequestsMsg[index] = {
          ...friendRequestsMsg[index],
          ...newValue,
        };
      }
    }

    return {
      friendRequestsMsg,
      pushFriendRequestsMsg,
      clearFriendRequestsMsg,
      updateFriendRequestsMsgStatus,
    };
  },
  { persist: true }
);
