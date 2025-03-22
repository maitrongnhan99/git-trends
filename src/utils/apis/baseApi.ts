/**
 * Base API utility functions for handling HTTP requests
 */

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

/**
 * Base fetch function with error handling
 */
const fetcher = async <T>(
  url: string,
  options?: RequestOptions
): Promise<T> => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method: options?.method ?? "GET",
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const error = data?.error || response.statusText;
    throw new Error(error);
  }

  return data as T;
};

/**
 * Common API methods
 */
const baseApi = {
  get: <T>(url: string, options?: Omit<RequestOptions, "method" | "body">) =>
    fetcher<T>(url, { ...options, method: "GET" }),

  post: <T>(
    url: string,
    body: Record<string, unknown>,
    options?: Omit<RequestOptions, "method">
  ) => fetcher<T>(url, { ...options, method: "POST", body }),

  put: <T>(
    url: string,
    body: Record<string, unknown>,
    options?: Omit<RequestOptions, "method">
  ) => fetcher<T>(url, { ...options, method: "PUT", body }),

  delete: <T>(url: string, options?: Omit<RequestOptions, "method">) =>
    fetcher<T>(url, { ...options, method: "DELETE" }),

  patch: <T>(
    url: string,
    body: Record<string, unknown>,
    options?: Omit<RequestOptions, "method">
  ) => fetcher<T>(url, { ...options, method: "PATCH", body }),
};

export { baseApi };
