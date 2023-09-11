import 'vue-router';
import type { MessagePluginType } from 'tdesign-vue-next';
import type { Socket } from 'socket.io-client';
import type { Database } from '@jlongster/sql.js';
import type { Emitter } from './utils/emitter/Emitter';
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $messagePlugin: MessagePluginType;
  }
}

declare global {
  interface Window {
    $socket: null | Socket;
    $messagePlugin: MessagePluginType;
    onlineChatDb: Database | null;
    $evt: Emitter;
    $db: Database | null;
  }
}
