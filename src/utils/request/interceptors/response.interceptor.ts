import { AxiosError } from 'axios';
import { removeAuthorization } from '@/utils/utils';
import { type AxiosResponseInterceptor } from '../types/axios';

const onUnauthorized: AxiosResponseInterceptor = {
  onFulfilled: async (response) => {
    if (response.data.code !== 0) {
      await window.$messagePlugin.error(response.data.msg);
      return await Promise.reject(response); // reject response to trigger onRejected
    }
    return response;
  },

  onRejected: async (error, options) => {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 401:
          removeAuthorization();
          await options?.router?.push('/login');
          break;
        case 500:
          await window.$messagePlugin.error('服务器错误');
          break;
        case 400:
          await window.$messagePlugin.error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/strict-boolean-expressions
            error.response?.data?.msg || error?.message || '请求错误'
          );
          break;
      }
      return await Promise.reject<AxiosError>(error);
    }
    return await Promise.reject(error);
  },
};

// other response interceptors

export const responseInterceptors = [onUnauthorized];
