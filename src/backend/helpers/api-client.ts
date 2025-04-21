import { httpRequest } from "@/config/http"

import type { RequestConfig } from "@/config/http"

export const api = {
  get: <ResponseType = unknown>(
    url: string,
    options?: Partial<
      Omit<RequestConfig<unknown, ResponseType>, "url" | "method" | "customURL">
    >,
  ) => httpRequest<unknown, ResponseType>(url, "GET", options),

  post: <RequestType = unknown, ResponseType = unknown>(
    url: string,
    body?: RequestType,
    options?: Partial<
      Omit<
        RequestConfig<RequestType, ResponseType>,
        "url" | "method" | "customURL" | "body"
      >
    >,
  ) =>
    httpRequest<RequestType, ResponseType>(url, "POST", { ...options, body }),

  put: <RequestType = unknown, ResponseType = unknown>(
    url: string,
    body: RequestType,
    options?: Partial<
      Omit<
        RequestConfig<RequestType, ResponseType>,
        "url" | "method" | "customURL" | "body"
      >
    >,
  ) => httpRequest<RequestType, ResponseType>(url, "PUT", { ...options, body }),

  delete: <ResponseType = unknown>(
    url: string,
    options?: Partial<
      Omit<RequestConfig<unknown, ResponseType>, "url" | "method" | "customURL">
    >,
  ) => httpRequest<unknown, ResponseType>(url, "DELETE", options),

  patch: <RequestType = unknown, ResponseType = unknown>(
    url: string,
    body: RequestType,
    options?: Partial<
      Omit<
        RequestConfig<RequestType, ResponseType>,
        "url" | "method" | "customURL" | "body"
      >
    >,
  ) =>
    httpRequest<RequestType, ResponseType>(url, "PATCH", { ...options, body }),
}
