import { CustomAxios as Axios } from './Axios';
import merge from 'lodash-es/merge';
import type { CreateAxiosOptions } from './types/axios';
import { interceptors } from './interceptors';

const defaultCreateAxiosOptions: CreateAxiosOptions = {
  // baseURL, // 服务器地址
  withCredentials: true, // 跨域请求时是否需要使用凭证
  timeout: 1000 * 60 * 5, // 超时时间 ms
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }, // 默认请求头
  interceptors,
};

function createAxios(options?: Partial<CreateAxiosOptions>): Axios {
  return new Axios(merge(defaultCreateAxiosOptions, options));
}

export const request = createAxios();
