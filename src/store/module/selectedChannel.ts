import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSelectedChannelStore = defineStore(
  'selectedChannel',
  () => {
    const selectedChannelId = ref<string | null>(null);

    function setSelectedChannelId(channelId: string) {
      selectedChannelId.value = channelId;
    }

    return {
      selectedChannelId,
      setSelectedChannelId,
    };
  },
  { persist: true }
);
