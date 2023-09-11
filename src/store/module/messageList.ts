import { type MessageDto } from '@/service/dto/message.dto';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMessageListStore = defineStore(
  'messageList',
  () => {
    const messageList = ref<Record<string, MessageDto[]>>({});

    function getMessageList(channelId: string) {
      return messageList.value[channelId];
    }

    function getMessage(channelId: string, msgId: string) {
      return messageList.value[channelId]?.find((item) => item.id === msgId);
    }

    function updateMessage(channelId: string, message: MessageDto) {
      // 根据channelId和message.id更新messageList，保持响应式
      if (messageList.value[channelId] !== undefined) {
        messageList.value[channelId] = [message];
      }
    }

    function addMessage(channelId: string, message: MessageDto) {
      if (getMessage(channelId, message.id) === undefined) {
        if (messageList.value[channelId] === undefined) {
          messageList.value[channelId] = [message];
        } else {
          messageList.value[channelId].push(message);
        }
      } else {
        // updateMessage(channelId, message); 暂时不需要新增消息时更新消息
      }
    }

    /**
     * 设置消息列表，当消息列表已存在时不会执行操作，仅用于初始化
     * @param channelId 频道id
     * @param messages 消息列表
     */
    function setMessageListOnLoad(channelId: string, messages: MessageDto[]) {
      if (messageList.value[channelId] === undefined) {
        messageList.value[channelId] = messages;
      }
    }

    /**
     * 判断频道是否有消息
     * @param channelId 频道id
     * @returns 是否有消息 true: 有消息 false: 没有消息
     */
    function channelHasMessage(channelId: string) {
      return messageList.value[channelId] !== undefined;
    }

    return {
      messageList,
      getMessageList,
      getMessage,
      addMessage,
      updateMessage,
      setMessageListOnLoad,
      channelHasMessage,
    };
  },
  { persist: true }
);
