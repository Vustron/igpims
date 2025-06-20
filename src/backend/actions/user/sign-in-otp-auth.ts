import { signInOtpAuthenticatorSchema } from "@/validation/user"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useOtpStore } from "@/hooks/use-otp-store"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { SignInOtpAuthenticatorPayload } from "@/validation/user"
import type { Account } from "@/backend/db/schemas"

export async function signInOtpAuthenticator(
  payload: SignInOtpAuthenticatorPayload,
): Promise<Account> {
  return api.post<SignInOtpAuthenticatorPayload, Account>(
    "auth/sign-in-otp-authenticator",
    payload,
  )
}

export const useSignInOtpAuthenticator = () => {
  const router = useRouter()
  const resetOtpSignIn = useOtpStore((state) => state.resetOtpSignIn)
  return useMutation({
    mutationKey: [`sign-in-user-otp-authenticator-${new Date()}`],
    mutationFn: async (payload: SignInOtpAuthenticatorPayload) => {
      const sanitizedData = sanitizer<SignInOtpAuthenticatorPayload>(
        payload,
        signInOtpAuthenticatorSchema,
      )
      return await signInOtpAuthenticator(sanitizedData)
    },
    onSuccess: () => {
      router.push("/")
    },
    onSettled: (account) => {
      if (account?.otpSignIn) {
        useOtpStore.getState().toggleOtpSignIn()
        return
      }
      resetOtpSignIn()
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
