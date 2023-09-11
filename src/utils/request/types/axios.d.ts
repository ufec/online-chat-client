import { type ResultDto } from '@/service/dto/result.dto';
import type {
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { Router } from 'vue-router';

export interface AxiosInterceptorCustomOptions {
  router?: Router;
}

export interface AxiosInterceptorTemplate<T> {
  onFulfilled: (value: T, options?: AxiosInterceptorCustomOptions) => T | Promise<T>;
  onRejected: (error: any, options?: AxiosInterceptorCustomOptions) => unknown;
  options?: AxiosInterceptorOptions;
}

export type AxiosRequestInterceptor = AxiosInterceptorTemplate<InternalAxiosRequestConfig>;

export type AxiosResponseInterceptor = AxiosInterceptorTemplate<AxiosResponse<ResultDto>>;

// 所有拦截器
export interface Interceptors {
  request?: AxiosRequestInterceptor[];
  response?: AxiosResponseInterceptor[];
}

export interface RequestOptions {
  restfulParams?: Record<string, string>; // restful参数
}

// 扩展创建axios实例的配置
export interface CreateAxiosOptions extends AxiosRequestConfig {
  interceptors?: Interceptors;
}
