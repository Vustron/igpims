import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { signUpSchema } from "@/schemas/user"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { QueryFilters } from "@tanstack/react-query"
import type { User } from "@/schemas/drizzle-schema"
import type { SignUpPayload } from "@/schemas/user"

interface SignUpUserProps {
  isSignIn?: boolean
}

export async function signUp(payload: SignUpPayload): Promise<User> {
  return api.post<SignUpPayload, User>("auth/sign-up", payload)
}

export const useSignUpUser = ({ isSignIn }: SignUpUserProps = {}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [`sign-up-user-${new Date()}`],
    mutationFn: async (payload: SignUpPayload) => {
      const sanitizedData = sanitizer<SignUpPayload>(payload, signUpSchema)
      return await signUp(sanitizedData)
    },
    onSuccess: async (newUser: User) => {
      const queryFilter: QueryFilters = {
        queryKey: ["users"],
      }
      await queryClient.cancelQueries(queryFilter)
      queryClient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) {
          return [newUser]
        }
        return [...oldData, newUser]
      })
      if (isSignIn) {
        router.push("/sign-in")
        return
      }
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
