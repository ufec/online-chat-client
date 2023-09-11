import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChannelMemberDto } from '@/common/interface';

export const useChannelMapStore = defineStore(
  'channelMap',
  () => {
    const channelMap = ref<Record<string, ChannelMemberDto>>({});

    function hasChannel(channelId: string) {
      return channelMap.value[channelId] === undefined;
    }

    function getChannel(channelId: string) {
      return channelMap.value[channelId];
    }

    function deleteChannel(channelId: string) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete channelMap.value[channelId];
    }

    /**
     * update or add channel
     * @param channel
     */
    function addChannel(channel: ChannelMemberDto) {
      channelMap.value[channel.channelId] = channel;
    }

    function pushChannel(channels: ChannelMemberDto[]) {
      channels.forEach((channel) => {
        channelMap.value[channel.channelId] = channel;
      });
    }

    return {
      channelMap,
      hasChannel,
      getChannel,
      addChannel,
      pushChannel,
      deleteChannel,
    };
  },
  { persist: true }
);
