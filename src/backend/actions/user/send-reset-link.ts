import { api } from "@/backend/helpers/api-client"
import { sendEmailSchema } from "@/schemas/user"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { SendEmailPayload } from "@/schemas/user"

export async function sendResetLink(payload: SendEmailPayload) {
  return api.post<SendEmailPayload>("auth/send-reset-link", payload)
}

export const useSendResetLink = () => {
  const router = useRouter()
  return useMutation({
    mutationKey: [`send-reset-link-${new Date()}`],
    mutationFn: async (payload: SendEmailPayload) => {
      const sanitizedData = sanitizer<SendEmailPayload>(
        payload,
        sendEmailSchema,
      )
      return await sendResetLink(sanitizedData)
    },
    onSuccess: () => {
      router.push("/reset-password")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
