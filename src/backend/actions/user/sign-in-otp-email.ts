import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { Account } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { useOtpStore } from "@/hooks/use-otp-store"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { SignInOtpEmailPayload, signInOtpEmailSchema } from "@/validation/user"

export async function signInOTPEmail(
  payload: SignInOtpEmailPayload,
): Promise<Account> {
  return api.post<SignInOtpEmailPayload, Account>(
    "auth/sign-in-otp-email",
    payload,
  )
}

export const useSignInOTPEmail = () => {
  const router = useRouter()
  const resetOtpSignIn = useOtpStore((state) => state.resetOtpSignIn)
  return useMutation({
    mutationKey: [`sign-in-user-otp-email-${new Date()}`],
    mutationFn: async (payload: SignInOtpEmailPayload) => {
      const sanitizedData = sanitizer<SignInOtpEmailPayload>(
        payload,
        signInOtpEmailSchema,
      )
      return await signInOTPEmail(sanitizedData)
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
