<template>
  <div class="main-content-wrapper friends-wrapper">
    <div class="header">好友列表</div>
    <div class="content">
      <ul class="friend-list">
        <li
          v-for="friend in friendListStore.friendList"
          :key="friend.friendInfo.id"
          class="friend-item"
        >
          <div class="friend-item-container">
            <UserInfo :user-info="friend.friendInfo" :remark="friend.remark">
              <template #operations>
                <div class="operations">
                  <Button class="operate" @click="handleChat(friend)">发起聊天</Button>
                  <Button
                    class="operate"
                    theme="danger"
                    :loading="isLoading"
                    :disabled="isLoading"
                    @click="handelDelete(friend)"
                    >删除好友</Button
                  >
                </div>
              </template>
            </UserInfo>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UserInfo from '@/components/UserInfo.vue';
import { onMounted, ref } from 'vue';
import { getFriendList, deleteFriend } from '@/service/friend.service';
import { Button } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { useFriendListStore, useChannelMapStore } from '@/store';
import { FriendDto } from '@/service/dto/friend.dto';
import { REQUEST_SUCCESS_CODE } from '@/common/constants';
// pina store
const friendListStore = useFriendListStore();
const channelMapStore = useChannelMapStore();

const router = useRouter();

const isLoading = ref(false);

onMounted(async () => {
  if (friendListStore.friendList.length === 0) {
    const res = await getFriendList();
    if (res.data.code === 0) {
      friendListStore.setFriendList(res.data.data.list);
    }
  }
});

const handleChat = async (friend: FriendDto) => {
  await router.push({
    name: 'Channel',
    params: {
      channelId: friend.channelId,
    },
  });
};

const handelDelete = async (friend: FriendDto) => {
  isLoading.value = false;
  const res = await deleteFriend(friend.friendInfo.id);
  if (res.data.code === REQUEST_SUCCESS_CODE) {
    // 删除成功
    channelMapStore.deleteChannel(friend.channelId); // 移除会话列表
    friendListStore.deleteFriend(friend.friendInfo.id); // 删除朋友列表缓存
  }
  isLoading.value = true;
};
</script>

<style scoped lang="less">
.friend-list {
  .friend-item {
    .friend-item-container {
      border-bottom: 1px solid var(--td-brand-color);
      .operations {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .operate {
          font-size: small;
          text-align: center;
          &:not(:first-child) {
            margin-top: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
