import { defineStore } from 'pinia';
import type { FriendDto } from '@/service/dto/friend.dto';
import { ref } from 'vue';

export const useFriendListStore = defineStore(
  'friendList',
  () => {
    const friendList = ref<FriendDto[]>([]);

    /**
     * @description: 设置好友列表
     * @param {FriendDto[]} list
     * @return {*}
     */
    const setFriendList = (list: FriendDto[]) => {
      friendList.value = list;
    };

    /**
     * @description: 检查好友是否存在
     */
    const checkFriendExist = (friendId: number) => {
      return friendList.value.some((item) => item.friendInfo.id === friendId);
    };

    /**
     * @description: 删除好友
     * @param {number} friendId
     * @return {*}
     */
    const deleteFriend = (friendId: number) => {
      // 直接使用filter
      friendList.value = friendList.value.filter((item) => item.friendInfo.id !== friendId);
    };

    /**
     * @description: 更新好友信息
     * @param {FriendDto} friend
     * @return {*}
     */
    const updateFriend = (friend: FriendDto) => {
      const index = friendList.value.findIndex(
        (item) => item.friendInfo.id === friend.friendInfo.id
      );
      if (index !== -1) {
        friendList.value.splice(index, 1, friend);
      }
    };

    /**
     * @description: 添加好友
     * @param {FriendDto} friend
     * @return {*}
     */
    const addFriend = (friend: FriendDto) => {
      if (checkFriendExist(friend.friendInfo.id)) {
        return;
      }
      friendList.value.push(friend);
    };

    return {
      friendList,
      setFriendList,
      checkFriendExist,
      deleteFriend,
      updateFriend,
      addFriend,
    };
  },
  { persist: true }
);
