import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestBodyType, RequestMethod } from './types/fetchClientShared';
import { BASE_URL, RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, UNAUTHORIZED_STATUS_CODE } from '../data/constants/constants';

interface ApiError {
  status: number;
  message: string;
  data?: any;
}

function requestFullResponse<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: any,
  contentType?: RequestBodyType,
): Promise<AxiosResponse<T>> {
  // Default content type to 'application/x-www-form-urlencoded' if not provided
  const finalContentType = contentType || 'application/x-www-form-urlencoded';

  // Construct request options
  const options: AxiosRequestConfig = {
    method,
    url: url,
    withCredentials: true,
    headers: {
      'Content-Type': finalContentType,
    },
    data: method !== 'GET' ? data : undefined, // Include data only for POST, PATCH, and DELETE requests
  };

  // Make the HTTP request and handle errors
  return axios(options)
    .then(response => {
      // Check if response status is 200 and data contains specific error message
      if (response.status === RESPONSE_STATUS_OK && response.data === 'This session has been expired (possibly due to multiple concurrent logins being attempted as the same user).') {
        const error: ApiError = {
          status: UNAUTHORIZED_STATUS_CODE,
          message: 'Session expired',
          data: response.data,
        };
        return Promise.reject(error);
      }
      return response;
    })
    .catch(error => {
      if (!url.includes('login')
        && error.response?.status === 401
        && url !== BASE_URL) {
        window.location.reload();
      }

      const status = error.response?.status || RESPONSE_STATUS_ERROR;
      const message = error.response?.statusText || 'An error occurred';
      const errorData = error.response?.data;

      // Return a structured error response
      const apiError: ApiError = {
        status,
        message,
        data: errorData,
      };
      return Promise.reject(apiError);
    });
}

export const fetchClientFullResponse = {
  get: <T>(url: string) =>
    requestFullResponse<T>(url, 'GET'),
  post: <T>(url: string, data?: any, contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'text/plain') =>
    requestFullResponse<T>(url, 'POST', data, contentType),
  patch: <T>(url: string, data: any, contentType?: 'application/x-www-form-urlencoded' | 'application/json') =>
    requestFullResponse<T>(url, 'PATCH', data, contentType),
  put: <T>(url: string, data?: any, contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'text/plain') =>
    requestFullResponse<T>(url, 'PUT', data, contentType),
  delete: <T>(url: string, data?: any, contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'text/plain') =>
    requestFullResponse<T>(url, 'DELETE', data, contentType),
};
