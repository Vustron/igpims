import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { PaginatedLockersResponse } from "@/backend/actions/locker/find-many"

export async function deleteLockerById(id: string) {
  return api.delete("lockers/delete-locker-by-id", {
    params: { id },
  })
}

export const useDeleteLockerById = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [`delete-locker-by-id-${id}-${new Date()}`],
    mutationFn: async () => {
      return await deleteLockerById(id)
    },
    onSuccess: async () => {
      // Cancel any ongoing queries for lockers
      await queryClient.cancelQueries({
        queryKey: ["lockers"],
      })

      // Update paginated data in cache
      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: ["lockers"] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData

          const filteredData = oldData.data.filter((locker) => locker.id !== id)
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
        },
      )

      // Update infinite queries
      queryClient.setQueriesData(
        { queryKey: ["lockers-infinite"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedLockersResponse) => {
              if (!page || !page.data) return page

              const filteredData = page.data.filter(
                (locker) => locker.id !== id,
              )
              const newTotalItems = Math.max(0, page.meta.totalItems - 1)

              return {
                ...page,
                data: filteredData,
                meta: {
                  ...page.meta,
                  totalItems: newTotalItems,
                  totalPages: Math.max(
                    1,
                    Math.ceil(newTotalItems / page.meta.limit),
                  ),
                  hasNextPage:
                    page.meta.page < Math.ceil(newTotalItems / page.meta.limit),
                  hasPrevPage: page.meta.page > 1,
                },
              }
            },
          )

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )
      router.push("/locker-rental")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] })
      queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] })
    },
    onError: (error) => catchError(error),
  })
}
