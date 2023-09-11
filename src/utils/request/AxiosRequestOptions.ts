import { type AxiosRequestConfig } from 'axios';

export interface AxiosRequestOptions extends AxiosRequestConfig {
  authenticationScheme?: 'Bearer' | 'Basic' | string;
}
