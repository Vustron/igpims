import { ZodError } from "zod"

export interface ErrorResponseData {
  message: string
  statusCode?: number
}

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "HttpError"
  }
}

export class ErrorHandler {
  public static handleError(error: unknown): ErrorResponseData {
    if (error instanceof HttpError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
      }
    }

    if (ErrorHandler.isZodError(error)) {
      return ErrorHandler.handleZodError(error)
    }

    if (error instanceof Error) {
      return ErrorHandler.handleGenericError(error)
    }

    return ErrorHandler.handleUnknownError(error)
  }

  private static isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError
  }

  private static handleZodError(error: ZodError): ErrorResponseData {
    const message = error.errors.map((e) => e.message).join(", ")
    return {
      message: `Validation error: ${message}`,
      statusCode: 400,
    }
  }

  private static handleGenericError(error: Error): ErrorResponseData {
    return {
      message: error.message || "An unexpected error occurred.",
      statusCode: 500,
    }
  }

  private static handleUnknownError(error: unknown): ErrorResponseData {
    return {
      message: typeof error === "string" ? error : "An unknown error occurred.",
      statusCode: 500,
    }
  }
}
