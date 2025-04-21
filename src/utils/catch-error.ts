import toast from "react-hot-toast"

import { ErrorHandler } from "@/utils/error"

import type { ErrorResponseData } from "@/utils/error"

export const catchError = (error: unknown, type?: "isToast"): string => {
  const { message }: ErrorResponseData = ErrorHandler.handleError(error)

  if (type === "isToast") {
    return toast.error(message)
  }

  return message
}
