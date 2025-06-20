import { api } from "@/backend/helpers/api-client"
import { sendEmailSchema } from "@/validation/user"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { SendEmailPayload } from "@/validation/user"

export async function sendVerifyLink(payload: SendEmailPayload) {
  return api.post<SendEmailPayload>("auth/send-verify-link", payload)
}

export const useSendVerifyLink = () => {
  const router = useRouter()
  return useMutation({
    mutationKey: [`send-verify-link-${new Date()}`],
    mutationFn: async (payload: SendEmailPayload) => {
      const sanitizedData = sanitizer<SendEmailPayload>(
        payload,
        sendEmailSchema,
      )
      return await sendVerifyLink(sanitizedData)
    },
    onSuccess: () => {
      router.push("/verify")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
