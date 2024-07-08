import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Retrieve public token from environment variables
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

/**
 * Makes an HTTP request to the specified URL with the given method and optional data.
 * @param url - The URL for the request.
 * @param method - The HTTP method for the request (default is 'GET').
 * @param data - Optional data to be included in the request body (only for POST requests).
 * @returns A Promise resolving to the response data.
 */
function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: any,
  contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'text/plain' | 'none'
): Promise<T> {
  // Default content type to 'application/x-www-form-urlencoded' if not provided
  const finalContentType = contentType || 'application/x-www-form-urlencoded';

  // Construct request options
  const options: AxiosRequestConfig = {
    method,
    url: url,
    withCredentials: true,
    headers: {
      'Content-Type': finalContentType
    },
    data: method === 'POST' || method === 'PATCH' || method === 'DELETE' || method === 'PUT' ? data : undefined, // Include data only for POST and PATCH requests
  };

  // Make the HTTP request and return a Promise resolving to the response data
  return axios(options)
    .then((response: any) => response.data);
}

// Client for making API requests
export const fetchClient = {
  // HTTP GET request
  get: <T>(url: string) => request<T>(url, 'GET'),
  // HTTP POST request
  post: <T>(url: string, data?: any, contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'text/plain') => request<T>(url, 'POST', data, contentType),
  // HTTP PATCH request
  patch: <T>(url: string, data: any, contentType?: 'application/x-www-form-urlencoded' | 'application/json') => request<T>(url, 'PATCH', data, contentType),
  // HTTP PUT request
  put: <T>(url: string, data?: any, contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'text/plain') => request<T>(url, 'PUT', data, contentType),
  // HTTP DELETE request
  delete: <T>(url: string, data?: any,  contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'none') => request<T>(url, 'DELETE', data, contentType),
};
