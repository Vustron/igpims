import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { User } from "@/backend/db/schemas"

export async function deleteUserById(id: string) {
  return api.delete("auth/delete-user-by-id", {
    params: { id },
  })
}

export const useDeleteUserById = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [`delete-user-by-id-${id}-${new Date()}`],
    mutationFn: async () => {
      return await deleteUserById(id)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["users"] })
      await queryClient.cancelQueries({ queryKey: ["users-infinite"] })
      await queryClient.cancelQueries({ queryKey: ["user", id] })

      const previousUsers = queryClient.getQueryData(["users"])
      const previousUsersInfinite = queryClient.getQueryData(["users-infinite"])
      const previousUser = queryClient.getQueryData(["user", id])

      return {
        previousUsers,
        previousUsersInfinite,
        previousUser,
      }
    },
    onSuccess: async () => {
      queryClient.setQueriesData({ queryKey: ["users"] }, (oldData: any) => {
        if (!oldData) return oldData

        if (oldData.data && Array.isArray(oldData.data)) {
          const filteredData = oldData.data.filter(
            (user: User) => user.id !== id,
          )
          const newTotalItems = Math.max(0, oldData.meta.totalItems - 1)

          return {
            ...oldData,
            data: filteredData,
            meta: {
              ...oldData.meta,
              totalItems: newTotalItems,
              totalPages: Math.max(
                1,
                Math.ceil(newTotalItems / oldData.meta.limit),
              ),
              hasNextPage:
                oldData.meta.page <
                Math.ceil(newTotalItems / oldData.meta.limit),
              hasPrevPage: oldData.meta.page > 1,
            },
          }
        }

        if (Array.isArray(oldData)) {
          return oldData.filter((user: User) => user.id !== id)
        }

        return oldData
      })

      queryClient.setQueriesData(
        { queryKey: ["users-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              if (!page?.data) return page

              return {
                ...page,
                data: page.data.filter((user: User) => user.id !== id),
                meta: page.meta
                  ? {
                      ...page.meta,
                      totalItems: Math.max(0, page.meta.totalItems - 1),
                      totalPages: Math.max(
                        1,
                        Math.ceil((page.meta.totalItems - 1) / page.meta.limit),
                      ),
                      hasNextPage:
                        page.meta.page <
                        Math.ceil((page.meta.totalItems - 1) / page.meta.limit),
                      hasPrevPage: page.meta.page > 1,
                    }
                  : page.meta,
              }
            }),
          }
        },
      )

      queryClient.removeQueries({ queryKey: ["user", id] })
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
      if (context?.previousUser) {
        queryClient.setQueryData(["user", id], context.previousUser)
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
