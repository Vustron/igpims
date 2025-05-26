import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { signInSchema } from "@/schemas/user"
import { sanitizer } from "@/utils/sanitizer"

import { useOtpStore } from "@/hooks/use-otp-store"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { Account } from "@/schemas/drizzle-schema"
import type { SignInPayload } from "@/schemas/user"

export async function signIn(payload: SignInPayload): Promise<Account> {
  return api.post<SignInPayload, Account>("auth/sign-in", payload)
}

export const useSignInUser = () => {
  const router = useRouter()
  const resetOtpSignIn = useOtpStore((state) => state.resetOtpSignIn)

  return useMutation({
    mutationKey: [`sign-in-user-${new Date()}`],
    mutationFn: async (payload: SignInPayload) => {
      const sanitizedData = sanitizer<SignInPayload>(payload, signInSchema)
      return await signIn(sanitizedData)
    },
    onSuccess: (account) => {
      if (account.otpSignIn) {
        useOtpStore.getState().toggleOtpSignIn()
        return router.push(`/sign-in?userId=${account.userId}`)
      }
      resetOtpSignIn()
      router.push("/")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
