import { TOKEN_STORAGE_KEY } from '@/common/constants';
import type { OnlineChatToken } from '@/common/interface';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore(
  TOKEN_STORAGE_KEY,
  () => {
    const accessToken = ref<string>('');
    const refreshToken = ref<string>('');

    const setToken = (token: OnlineChatToken) => {
      accessToken.value = token.accessToken;
      refreshToken.value = token.refreshToken;
    };

    const clearToken = () => {
      accessToken.value = '';
      refreshToken.value = '';
    };

    return { accessToken, refreshToken, setToken, clearToken };
  },
  { persist: true }
);
