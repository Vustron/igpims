import { resetPasswordSchema } from "@/validation/user"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { ResetPasswordPayload } from "@/validation/user"

export async function resetPassword(payload: ResetPasswordPayload) {
  return api.post<ResetPasswordPayload>("auth/reset-password", payload)
}

export const useResetPassword = () => {
  const router = useRouter()
  return useMutation({
    mutationKey: [`reset-password-${new Date()}`],
    mutationFn: async (payload: ResetPasswordPayload) => {
      const sanitizedData = sanitizer<ResetPasswordPayload>(
        payload,
        resetPasswordSchema,
      )
      return await resetPassword(sanitizedData)
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
