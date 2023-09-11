import { init } from '@/utils/database/init';
// import { insertToLocalChatLogs, findFromLocalChatLogs } from '@/utils/database/sql';

const eventMap = {
  initDB: (args: unknown) => {
    init(args as string)
      .then((res) => {
        self.postMessage({ method: 're:initDB', res, err: null });
      })
      .catch((err: unknown) => {
        self.postMessage({ method: 're:initDB', res: null, err });
      });
  },
};

interface EventData {
  method: keyof typeof eventMap;
  args: unknown;
}

// 注册监听事件
self.addEventListener(
  'message',
  (event: MessageEvent<EventData>) => {
    eventMap[event.data.method](event.data.args);
  },
  false
);
