import { env } from "@/config/env"
import { dataSerializer } from "@/utils/data-serializer"
import { HttpError } from "@/utils/error"
import { buildQueryString } from "@/utils/query-string"

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS"

export type ContentType = "json" | "form" | "text" | "blob" | "arrayBuffer"

export interface RequestConfig<RequestType = unknown, ResponseType = unknown> {
  url?: string
  method: HttpMethod
  params?: Record<string, string | number | boolean | undefined | null>
  headers?: HeadersInit
  body?: RequestType
  transformResponse?: (data: unknown) => ResponseType
  customURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  contentType?: ContentType
}

function handleError(
  error: unknown,
  attempt: number,
  retries: number,
): HttpError {
  switch (true) {
    case error instanceof HttpError:
      return error
    case error instanceof Error && error.name === "AbortError":
      return new HttpError(408, "Request timed out")
    case error instanceof TypeError:
      return new HttpError(0, "Network error - please check your connection")
    case error instanceof SyntaxError:
      return new HttpError(500, "Invalid JSON response from server")
    case error instanceof RangeError:
      return new HttpError(400, "Invalid request parameters")
    case error instanceof ReferenceError:
      return new HttpError(500, "Internal reference error")
    case error instanceof URIError:
      return new HttpError(400, "Invalid URL format")
    case error instanceof Error && error.name === "TimeoutError":
      return new HttpError(408, "Request timeout")
    case error instanceof Error && error.name === "NetworkError":
      return new HttpError(0, "Network connection failed")
    default:
      return attempt < retries - 1
        ? new HttpError(0, "RETRY")
        : new HttpError(500, "The request failed after multiple attempts")
  }
}

function serializeBody(
  body: unknown,
  contentType: ContentType,
): BodyInit | null {
  switch (contentType) {
    case "json":
      return JSON.stringify(dataSerializer(body))
    case "form":
      return body instanceof FormData
        ? body
        : new URLSearchParams(body as Record<string, string>)
    case "text":
      return String(body)
    case "blob":
      return body as Blob
    case "arrayBuffer":
      return body as ArrayBuffer
    default:
      return JSON.stringify(dataSerializer(body))
  }
}

function getContentTypeHeader(contentType: ContentType): string {
  switch (contentType) {
    case "json":
      return "application/json"
    case "form":
      return "application/x-www-form-urlencoded"
    case "text":
      return "text/plain"
    case "blob":
      return "application/octet-stream"
    case "arrayBuffer":
      return "application/octet-stream"
    default:
      return "application/json"
  }
}

async function parseResponse(response: Response): Promise<unknown> {
  const textResponse = await response.text()

  if (!textResponse.trim()) return {}

  const contentType = response.headers.get("content-type")
  if (!contentType?.includes("application/json")) return textResponse

  return JSON.parse(textResponse)
}

async function handleErrorResponse(response: Response): Promise<never> {
  let errorMessage = response.statusText
  const contentType = response.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    const errorData = await response.json().catch(() => null)
    errorMessage = errorData?.error || errorData?.message || response.statusText
  }

  throw new HttpError(response.status, errorMessage)
}

async function makeHttpRequest<RequestType = unknown, ResponseType = unknown>(
  config: RequestConfig<RequestType, ResponseType>,
): Promise<ResponseType> {
  const {
    url,
    method,
    params,
    headers = {},
    body,
    transformResponse,
    customURL,
    timeout = 24 * 60 * 60 * 1000,
    retries = 3,
    retryDelay = 1000,
    contentType = "json",
  } = config

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const makeRequest = async (): Promise<ResponseType> => {
    if (!url && !customURL) {
      throw new HttpError(400, "No URL provided for the API request")
    }

    const fullUrl = url
      ? `${env.NEXT_PUBLIC_APP_URL}/api/v1/${url}${buildQueryString(params)}`
      : customURL

    const urlObject = new URL(fullUrl!)
    if (!["http:", "https:"].includes(urlObject.protocol)) {
      throw new HttpError(400, "URL must use HTTP or HTTPS protocol")
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...(contentType !== "form" || !(body instanceof FormData)
          ? { "Content-Type": getContentTypeHeader(contentType) }
          : {}),
        ...headers,
      },
      cache: "no-store",
      signal: controller.signal,
    }

    const methodsWithoutBody = ["GET", "HEAD", "OPTIONS"]

    if (methodsWithoutBody.includes(method) && body) {
      throw new HttpError(400, `${method} request should not have a body`)
    }

    if (body && !methodsWithoutBody.includes(method)) {
      requestOptions.body = serializeBody(body, contentType)
    }

    const response = await fetch(fullUrl!, requestOptions)

    if (!response.ok) {
      return await handleErrorResponse(response)
    }

    if (method === "HEAD") {
      return {} as ResponseType
    }

    const data = await parseResponse(response)
    const serializedData = dataSerializer(data)

    return transformResponse
      ? transformResponse(serializedData)
      : (serializedData as ResponseType)
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await makeRequest()
      clearTimeout(timeoutId)
      return result
    } catch (error) {
      const handledError = handleError(error, attempt, retries)

      if (handledError.message === "RETRY" && attempt < retries - 1) {
        const delay = retryDelay * 2 ** attempt
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      clearTimeout(timeoutId)
      controller.abort()
      throw handledError instanceof HttpError
        ? new Error(handledError.message)
        : new Error("An unexpected error occurred")
    }
  }

  clearTimeout(timeoutId)
  controller.abort()
  throw new Error("Request failed after all retry attempts")
}

export function httpRequest<RequestType = unknown, ResponseType = unknown>(
  urlOrCustomURL: string,
  method: HttpMethod,
  options: Partial<
    Omit<
      RequestConfig<RequestType, ResponseType>,
      "url" | "method" | "customURL"
    >
  > = {},
): Promise<ResponseType> {
  const isCustomURL =
    urlOrCustomURL.startsWith("http://") ||
    urlOrCustomURL.startsWith("https://")

  return makeHttpRequest<RequestType, ResponseType>({
    ...(isCustomURL ? { customURL: urlOrCustomURL } : { url: urlOrCustomURL }),
    method,
    ...options,
  })
}
