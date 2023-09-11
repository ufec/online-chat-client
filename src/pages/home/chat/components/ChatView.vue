<template>
  <div class="chat-wrapper">
    <div class="chat-search-container">
      <SearchUserBar></SearchUserBar>
    </div>
    <div class="chat-list-container">
      <div class="chat-list-wrapper">
        <ul class="chat-list">
          <li
            v-for="(channel, channelId) in channelMapStore.channelMap"
            :key="channelId"
            :class="{ 'chat-item': true, active: isActive(channelId) }"
            @click="($event: MouseEvent) => handleClickChannel($event, channelId)"
          >
            <ChannelInfo :channel-info="channel" />
          </li>
        </ul>
      </div>
      <div class="chat-list-bottom-wrapper">
        <InputGroup style="width: 100%">
          <Input clearable placeholder="请输入用户名" />
          <Button>词云</Button>
          <hr />
          <Button>添加</Button>
        </InputGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SearchUserBar from '@/components/SearchUserBar.vue';
import ChannelInfo from '@/components/ChannelInfo.vue';
import { Button, Input, InputGroup } from 'tdesign-vue-next';
import { useChannelMapStore, useMessageListStore, useFriendListStore } from '@/store';
import { useRouter } from 'vue-router';
import { getMyChannels } from '@/service/channel.service';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { queryMessagesByChannelIds } from '@/service/message.service';
import { getFriendList } from '@/service/friend.service';
import { REQUEST_SUCCESS_CODE } from '@/common/constants';

const channelMapStore = useChannelMapStore();
const messageListStore = useMessageListStore();
const friendListStore = useFriendListStore();
const router = useRouter();

const needLoadTailMessageChannelIds = ref<string[]>([]);

const isActive = (channelId: string) => {
  return router.currentRoute.value.params.channelId === channelId;
};

const handleClickChannel = async ($event: MouseEvent, channelId: string) => {
  await router.push({
    name: 'Channel',
    params: {
      channelId,
    },
  });
};

const loadTailMessage = () => {
  // 为了防止加载消息时，用户加载频道，导致消息加载错乱，先缓存上一次的channelId
  const temp = [...needLoadTailMessageChannelIds.value];
  queryMessagesByChannelIds(temp)
    .then((res) => {
      if (res.data.code === 0) {
        Object.entries(res.data.data).forEach(([channelId, messageList]) => {
          if (messageList[0].id !== channelMapStore.channelMap[channelId].channel.lastMessageId) {
            // 如果最新的消息id不等于channel的lastMessageId，说明有新消息 手动修正一下
            channelMapStore.channelMap[channelId].channel.lastMessageId = messageList[0].id;
            channelMapStore.addChannel(channelMapStore.channelMap[channelId]);
          }
          // 为什么要reverse？因为后端返回的是(新消息在前，旧消息在后)的顺序，而我们需要的是(旧消息在前，新消息在后)的顺序
          // 后面有新消息，直接 push 进去就行了，而下拉加载历史消息的时候，unshift 即可
          // 这里只是首次加载历史消息，所以需要 reverse 一下
          messageListStore.setMessageListOnLoad(channelId, messageList.reverse());
          // 插入完成，清理state中已经加载的channelId
          needLoadTailMessageChannelIds.value = needLoadTailMessageChannelIds.value.filter(
            (item) => item !== channelId
          );
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// 监听needLoadTailMessageChannelIds，如果有新的channelId，就加载当前频道的最新消息
const stopWatchLoadTailMsgChannelIds = watchEffect(() => {
  if (needLoadTailMessageChannelIds.value.length > 0) {
    loadTailMessage();
  }
});

const loadChannels = (page = 1, pageSize = 10) => {
  getMyChannels(page, pageSize)
    .then((res) => {
      if (res.data.code === 0) {
        const { total, list } = res.data.data;
        if (total > 0) {
          getFriendList()
            .then((friendListResp) => {
              if (friendListResp.data?.code === REQUEST_SUCCESS_CODE) {
                friendListStore.setFriendList(friendListResp.data?.data?.list);
                friendListResp.data?.data?.list?.forEach((friend) => {
                  const channel = channelMapStore.getChannel(friend.channelId);
                  if (channel) {
                    channel.channel.avatar = friend.friendInfo.avatar;
                    channelMapStore.addChannel(channel); //  会自动更新
                  }
                });
              }
            })
            .catch((e) => {
              throw e;
            });
          list.forEach((item) => {
            if (!messageListStore.channelHasMessage(item.channelId)) {
              needLoadTailMessageChannelIds.value.push(item.channelId);
            }
            channelMapStore.addChannel(item);
          });
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

onMounted(() => {
  // 如果channelMapStore.channelMap为空，说明是第一次加载，需要加载频道列表
  if (Object.keys(channelMapStore.channelMap).length === 0) {
    loadChannels();
  }
});

onUnmounted(() => stopWatchLoadTailMsgChannelIds());
</script>

<style scoped lang="less">
.chat-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .chat-search-container {
    flex: 0 0 7rem;
  }
  .chat-list-container {
    flex: 1;
    overflow: auto;
    background-color: #e6e5e5;
    display: flex;
    flex-direction: column;
    position: relative;
    &::-webkit-scrollbar {
      display: none;
    }

    .chat-list-wrapper {
      overflow-y: auto;
      .chat-list {
        padding-bottom: 3.2rem;
        .chat-item {
          height: 8.1rem;
          max-height: 8.1rem;
          cursor: pointer;
          &:hover {
            background-color: #c6c6c7;
            transition: all 0.3s;
          }
        }
        .active {
          background-color: #c6c6c7;
        }
      }
    }
    .chat-list-bottom-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
