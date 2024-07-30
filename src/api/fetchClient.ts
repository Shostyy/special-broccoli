import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestBodyType, RequestMethod } from './types/fetchClientShared';

interface RequestOptions<T> {
  url: string;
  method: RequestMethod;
  data?: T;
  contentType?: RequestBodyType;
}

/**
 * Makes an HTTP request to the specified URL with the given method and optional data.
 * @param options - The request options.
 * @returns A Promise resolving to the response data.
 */
async function request<T, R>({
  url,
  method,
  data,
  contentType,
}: RequestOptions<T>): Promise<R> {
  const config: AxiosRequestConfig = {
    method,
    url,
    withCredentials: true,
    headers: {
      'Content-Type': contentType || 'application/x-www-form-urlencoded',
    },
    data: method !== 'GET' ? data : undefined,
  };

  const response: AxiosResponse<R> = await axios(config);
  return response.data;
}

// Client for making API requests
export const fetchClient = {
  get: <R>(url: string) =>
    request<never, R>({ url, method: 'GET' }),
  post: <T, R>(url: string, data?: T, contentType?: RequestBodyType) =>
    request<T, R>({ url, method: 'POST', data, contentType }),
  patch: <T, R>(url: string, data: T, contentType?: RequestBodyType) =>
    request<T, R>({ url, method: 'PATCH', data, contentType }),
  put: <T, R>(url: string, data?: T, contentType?: RequestBodyType) =>
    request<T, R>({ url, method: 'PUT', data, contentType }),
  delete: <T, R>(url: string, data?: T, contentType?: RequestBodyType) =>
    request<T, R>({ url, method: 'DELETE', data, contentType }),
};