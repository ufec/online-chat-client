import { type Interceptors } from '../types/axios';
import { requestInterceptors } from './request.interceptor';
import { responseInterceptors } from './response.interceptor';

export const interceptors: Interceptors = {
  request: requestInterceptors,
  response: responseInterceptors,
};
