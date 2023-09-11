import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const store = createPinia();
store.use(createPersistedState());

// export { store };

export * from './module/friendRequestsMsg';
export * from './module/userInfo';
export * from './module/friendList';
export * from './module/sessionList';
export * from './module/token';
export * from './module/msgRecord';
export * from './module/channelMap';
export * from './module/selectedChannel';
export * from './module/messageList';

export default store;
