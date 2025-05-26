import { api } from "@/backend/helpers/api-client"
import { updateUserSchema } from "@/schemas/user"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { UpdateUserPayload } from "@/schemas/user"
import type { User } from "@/schemas/drizzle-schema"

export async function updateUserInfo(payload: UpdateUserPayload, id: string) {
  return api.patch<UpdateUserPayload, User>("auth/update-info", payload, {
    params: { id },
  })
}

export const useUpdateUserInfo = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [`update-user-${id}-${new Date()}`],
    mutationFn: async (payload: UpdateUserPayload) => {
      const sanitizedData = sanitizer<UpdateUserPayload>(
        payload,
        updateUserSchema,
      )
      return await updateUserInfo(sanitizedData, id)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user", id] })
      await queryClient.cancelQueries({ queryKey: ["users"] })
      await queryClient.cancelQueries({ queryKey: ["users-infinite"] })

      const previousUser = queryClient.getQueryData<User>(["user", id])
      const previousUsers = queryClient.getQueryData(["users"])
      const previousUsersInfinite = queryClient.getQueryData(["users-infinite"])

      return {
        previousUser,
        previousUsers,
        previousUsersInfinite,
      }
    },
    onSuccess: async (updatedUser: User) => {
      queryClient.setQueryData(["user", id], updatedUser)

      queryClient.setQueriesData({ queryKey: ["users"] }, (oldData: any) => {
        if (!oldData) return oldData

        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((user: User) =>
              user.id === id ? updatedUser : user,
            ),
          }
        }

        if (Array.isArray(oldData)) {
          return oldData.map((user: User) =>
            user.id === id ? updatedUser : user,
          )
        }

        return oldData
      })

      queryClient.setQueriesData(
        { queryKey: ["users-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data
                ? page.data.map((user: User) =>
                    user.id === id ? updatedUser : user,
                  )
                : page.data,
            })),
          }
        },
      )

      router.replace("/users")
    },
    onError: (error, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["user", id], context.previousUser)
      }
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
