import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"

interface SignOutUserProps {
  isVerify?: boolean
}

export async function signOut() {
  return api.post("auth/sign-out")
}

export const useSignOutUser = ({ isVerify }: SignOutUserProps = {}) => {
  const router = useRouter()
  return useMutation({
    mutationKey: [`sign-out-user-${new Date()}`],
    mutationFn: signOut,
    onSuccess: () => {
      if (isVerify) {
        router.push("/verify")
        return
      }
      router.push("/sign-in")
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
