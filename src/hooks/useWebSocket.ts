import { onMounted } from 'vue';
import { useUserInfoStore, useTokenStore } from '@/store';
import { io } from 'socket.io-client';

export function useWebSocket() {
  onMounted(() => {
    if (window?.$socket == null) {
      const userInfoStore = useUserInfoStore();
      const tokenStore = useTokenStore();
      window.$socket = io(import.meta.env.VITE_APP_BASE_URL, {
        auth: {
          accessToken: tokenStore.accessToken,
          refreshToken: tokenStore.refreshToken,
        },
        transports: ['websocket'],
        withCredentials: true,
        query: {
          userId: userInfoStore.userInfo?.id,
        },
        timestampRequests: true,
        timestampParam: '_t',
      });
    }
  });
}
