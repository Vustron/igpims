import { emailVerificationSchema } from "@/schemas/user"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { VerifyEmailPayload } from "@/schemas/user"

export async function verifyEmail(payload: VerifyEmailPayload) {
  return api.post<VerifyEmailPayload>("auth/verify-email", payload)
}

export const useVerifyEmail = () => {
  const router = useRouter()
  return useMutation({
    mutationKey: [`verify-email-${new Date()}`],
    mutationFn: async (payload: VerifyEmailPayload) => {
      const sanitizedData = sanitizer<VerifyEmailPayload>(
        payload,
        emailVerificationSchema,
      )
      return await verifyEmail(sanitizedData)
    },
    onSuccess: () => {
      router.push("/sign-in")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
