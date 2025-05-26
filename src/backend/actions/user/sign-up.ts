import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { signUpSchema } from "@/schemas/user"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { PaginatedUsersResponse } from "@/backend/actions/user/find-many"
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["users"] })
      await queryClient.cancelQueries({ queryKey: ["users-infinite"] })

      const previousUsers = queryClient.getQueryData(["users"])
      const previousUsersInfinite = queryClient.getQueryData(["users-infinite"])

      return {
        previousUsers,
        previousUsersInfinite,
      }
    },
    onSuccess: async (newUser: User) => {
      queryClient.setQueriesData<PaginatedUsersResponse>(
        { queryKey: ["users"] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData

          const updatedData = [newUser, ...oldData.data]
          const newTotalItems = oldData.meta.totalItems + 1

          return {
            ...oldData,
            data: updatedData,
            meta: {
              ...oldData.meta,
              totalItems: newTotalItems,
              totalPages: Math.ceil(newTotalItems / oldData.meta.limit),
              hasNextPage:
                oldData.meta.page <
                Math.ceil(newTotalItems / oldData.meta.limit),
              hasPrevPage: oldData.meta.page > 1,
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["users-infinite"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0) {
            const firstPage = { ...updatedPages[0] }
            const newTotalItems = firstPage.meta.totalItems + 1

            updatedPages[0] = {
              ...firstPage,
              data: [newUser, ...firstPage.data],
              meta: {
                ...firstPage.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(newTotalItems / firstPage.meta.limit),
              },
            }
          }

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      if (isSignIn) {
        router.push("/sign-in")
        return
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers)
      }
      if (context?.previousUsersInfinite) {
        queryClient.setQueryData(
          ["users-infinite"],
          context.previousUsersInfinite,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
