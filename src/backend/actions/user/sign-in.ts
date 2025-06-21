import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { Account } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { useOtpStore } from "@/hooks/use-otp-store"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { SignInPayload, signInSchema } from "@/validation/user"

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
