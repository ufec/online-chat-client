import type { MsgItem } from '@/common/interface';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useMsgRecordStore = defineStore(
  'msgRecord',
  () => {
    const msgRecord = reactive<Record<number, MsgItem[]>>({});

    const addMsg = (sessionId: number, msg: MsgItem) => {
      msgRecord[sessionId] = [...(msgRecord[sessionId] ?? []), msg];
    };

    const updateMsg = (sessionId: number, msg: MsgItem) => {
      const index = msgRecord[sessionId].findIndex((item) => item.msgId === msg.msgId);
      if (index > -1) {
        msgRecord[sessionId][index] = msg;
      }
    };

    const pushMsg = (sessionId: number, msgs: MsgItem[]) => {
      if (msgRecord[sessionId] !== undefined) {
        // 把msgs中不同的msg添加到msgRecord中
        const newMsgs = msgs.filter((msg) => {
          return !msgRecord[sessionId].some((item) => item.msgId === msg.msgId);
        });
        msgRecord[sessionId] = [...msgRecord[sessionId], ...newMsgs];
      } else {
        msgRecord[sessionId] = msgs;
      }
    };

    return {
      msgRecord,
      addMsg,
      updateMsg,
      pushMsg,
    };
  },
  { persist: true }
);
