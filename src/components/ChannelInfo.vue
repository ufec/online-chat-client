<template>
  <div class="channel-info-container">
    <div class="channel-avatar__wrapper">
      <Avatar
        :src="props.channelInfo.channel.avatar ?? './avatar_default.svg'"
        :alt="channelName"
        crossorigin="anonymous"
        size="large"
      />
    </div>
    <div class="channel-info__wrapper">
      <div class="channel-name">
        {{ channelName }}
      </div>
      <div class="channel-last-message">
        {{ lastMessage?.author?.nickname }}:
        {{ showMsg(lastMessage?.content ?? '', lastMessage?.msgType ?? MsgTypeEnum.TEXT) }}
      </div>
    </div>
    <div class="channel-operations__wrapper">
      <div class="chat-message-info">
        <span class="chat-message-read">{{ lastMessage?.msgStatus }}</span>
        <span class="chat-message-time">{{
          lastMessage?.createdAt ? dayjs(lastMessage?.createdAt).format('HH:mm') : ''
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChannelMemberDto, MsgTypeEnum } from '@/common/interface';
import Avatar from './Avatar.vue';
import { computed } from 'vue';
import { useMessageListStore } from '@/store/index';
import dayjs from 'dayjs';
import { showContentByType } from '@/utils/utils';

const messageListStore = useMessageListStore();

const props = defineProps<{
  channelInfo: ChannelMemberDto;
}>();

const channelName = computed(() => {
  return props.channelInfo.aliasChannelName ?? props.channelInfo.channel.channelName;
});

const lastMessage = computed(() => {
  const { id = '', lastMessageId = '' } = props.channelInfo.channel;
  if (id === '' || lastMessageId === '') {
    return;
  }
  const message = messageListStore.getMessage(id, lastMessageId);
  return message;
});

const showMsg = (content: string, msgType: MsgTypeEnum) => {
  return showContentByType(msgType, content);
};
</script>

<style scoped lang="less">
.channel-info-container {
  display: flex;
  align-items: center;
  padding: 0.7rem 0.5rem;
  width: 100%;
  .channel-avatar__wrapper {
    flex: 0 0 6rem;
    height: 6rem;
    width: 6rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .channel-info__wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 10px;
    justify-content: center;
    min-width: 0;
    .channel-name {
      font-size: larger;
    }
    .channel-last-message {
      font-size: small;
      margin-top: 6px;
    }
    .channel-name,
    .channel-last-message {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .channel-operations__wrapper {
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    .chat-message-info {
      display: flex;
      flex-direction: column;
      max-width: 5rem;
      text-align: center;
      .chat-message-read,
      .chat-message-time {
        font-size: 1.2rem;
        color: #999;
        display: inline-block;
      }
    }
  }
}
</style>
