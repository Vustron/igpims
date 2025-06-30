import { httpRequest, RequestConfig } from "@/config/http"
import { addKeyHeaders } from "./add-key-headers"

export const api = {
  get: <ResponseType = unknown>(
    url: string,
    options?: Partial<
      Omit<RequestConfig<unknown, ResponseType>, "url" | "method" | "customURL">
    >,
  ) => httpRequest<unknown, ResponseType>(url, "GET", addKeyHeaders(options)),

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
    httpRequest<RequestType, ResponseType>(url, "POST", {
      ...addKeyHeaders(options),
      body,
    }),

  put: <RequestType = unknown, ResponseType = unknown>(
    url: string,
    body: RequestType,
    options?: Partial<
      Omit<
        RequestConfig<RequestType, ResponseType>,
        "url" | "method" | "customURL" | "body"
      >
    >,
  ) =>
    httpRequest<RequestType, ResponseType>(url, "PUT", {
      ...addKeyHeaders(options),
      body,
    }),

  delete: <ResponseType = unknown>(
    url: string,
    options?: Partial<
      Omit<RequestConfig<unknown, ResponseType>, "url" | "method" | "customURL">
    >,
  ) =>
    httpRequest<unknown, ResponseType>(url, "DELETE", addKeyHeaders(options)),

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
    httpRequest<RequestType, ResponseType>(url, "PATCH", {
      ...addKeyHeaders(options),
      body,
    }),
}
