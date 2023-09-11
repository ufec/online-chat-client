import { TOKEN_STORAGE_KEY } from '@/common/constants';
import type { OnlineChatToken } from '@/common/interface';
import type { InternalAxiosRequestConfig } from 'axios';
import type { AxiosRequestInterceptor } from '../types/axios';

const withTokenInterceptor: AxiosRequestInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token !== null && config?.headers != null) {
      const { accessToken } = JSON.parse(token) as unknown as OnlineChatToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },

  onRejected: async (error: unknown) => {
    return await Promise.reject(error);
  },
};

// other request interceptors

export const requestInterceptors = [withTokenInterceptor];
