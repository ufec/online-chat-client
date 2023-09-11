import axios, {
  Axios,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { type CreateAxiosOptions, type RequestOptions } from './types/axios';
import router from '@/router/index';
// 自定义 Axios
export class CustomAxios {
  private readonly instance: AxiosInstance;

  constructor(private readonly options: CreateAxiosOptions) {
    this.instance = axios.create(this.options);
    if (this.options?.interceptors != null) {
      this.loadInterceptors();
    }
  }

  getAxios(): AxiosInstance {
    return this.instance;
  }

  /**
   * 加载所有拦截器
   */
  loadInterceptors() {
    // 加载所有请求拦截器
    this.options.interceptors?.request?.forEach((interceptor) => {
      this.instance.interceptors.request.use(
        interceptor.onFulfilled,
        interceptor.onRejected,
        interceptor.options
      );
    });
    // 加载所有响应拦截器
    this.options.interceptors?.response?.forEach((interceptor) => {
      this.instance.interceptors.response.use(
        // async (response) => await interceptor.onFulfilled(response),
        interceptor.onFulfilled,
        (error) => interceptor.onRejected(error, { router }),
        interceptor.options
      );
    });
  }

  /**
   * 为当前实例设置请求头
   * @param headers {key: value} 形式的请求头
   * @returns
   */
  setHeader(headers: Record<string, string>): void {
    if (!(this.instance instanceof Axios)) {
      return;
    }
    Object.assign(this.instance.defaults.headers, headers);
  }

  async get<T = any, D = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<T, AxiosRequestConfig<D>>> {
    return await this.request<T>(
      {
        ...config,
        method: 'GET',
        // paramsSerializer(params: any) {
        //   return stringify(params, { arrayFormat: 'repeat' });
        // },
        // wtf ?? paramsSerializer is not a function
        // paramsSerializer: {
        //   encode: (value: any, defaultEncoder: (value: any) => string): string => {
        //     console.log(value);
        //     return stringify(value, { arrayFormat: 'repeat' });
        //   },
        // },
      },
      options
    );
  }

  async post<T = any, D = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<T, AxiosRequestConfig<D>>> {
    return await this.request<T>({ ...config, method: 'POST' }, options);
  }

  async put<T = any, D = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<T, AxiosRequestConfig<D>>> {
    return await this.request<T>({ ...config, method: 'PUT' }, options);
  }

  async delete<T = any, D = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<T, AxiosRequestConfig<D>>> {
    return await this.request<T>({ ...config, method: 'DELETE' }, options);
  }

  async patch<T = any, D = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<T, AxiosRequestConfig<D>>> {
    return await this.request<T>({ ...config, method: 'PATCH' }, options);
  }

  async request<T = any, D = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<AxiosResponse<T, AxiosRequestConfig<D>>> {
    // 替换 url 中的 :id
    if (options?.restfulParams !== undefined && config?.url !== undefined) {
      config.url = config.url.replace(/:([a-zA-Z0-9]+)/g, (match, $1: string) => {
        if (options?.restfulParams !== undefined && options.restfulParams[$1] !== undefined) {
          return options.restfulParams[$1];
        }
        return match;
      });
    }
    return await new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
