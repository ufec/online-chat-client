import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { type ChatItem } from '@/common/interface';

export const useSessionListStore = defineStore(
  'sessionList',
  () => {
    const sessionList = reactive<ChatItem[]>([]);

    const addSession = (session: ChatItem) => {
      sessionList.push(session);
    };

    const removeSession = (id: number) => {
      const index = sessionList.findIndex((item) => item.userId === id);
      if (index !== -1) {
        sessionList.splice(index, 1);
      }
    };

    const updateSession = (session: ChatItem) => {
      const index = sessionList.findIndex((item) => item.userId === session.userId);
      if (index !== -1) {
        sessionList.splice(index, 1, session);
      }
    };

    const hasSession = (id: number) => {
      return sessionList.some((item) => item.userId === id);
    };

    return {
      sessionList,
      addSession,
      removeSession,
      updateSession,
      hasSession,
    };
  },
  { persist: true }
);
