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
    mutationKey: [ `delete-locker-by-id-${id}-${new Date()}` ],
    mutationFn: async () => {
      return await deleteLockerById(id)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [ "lockers" ] })
      await queryClient.cancelQueries({ queryKey: [ "lockers-infinite" ] })
      await queryClient.cancelQueries({ queryKey: [ "locker-rentals" ] })
      await queryClient.cancelQueries({ queryKey: [ "locker-rentals-infinite" ] })
      await queryClient.cancelQueries({ queryKey: [ "locker", id ] })

      const previousLockers = queryClient.getQueryData([ "lockers" ])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])
      const previousRentals = queryClient.getQueryData([ "locker-rentals" ])
      const previousRentalsInfinite = queryClient.getQueryData([
        "locker-rentals-infinite",
      ])

      return {
        previousLockers,
        previousLockersInfinite,
        previousRentals,
        previousRentalsInfinite,
      }
    },
    onSuccess: async () => {
      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: [ "lockers" ] },
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

      queryClient.setQueriesData(
        { queryKey: [ "lockers-infinite" ] },
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

      queryClient.removeQueries({ queryKey: [ "locker", id ] })

      router.push("/locker-rental")
    },
    onError: (error, _variables, context) => {
      if (context?.previousLockers) {
        queryClient.setQueryData([ "lockers" ], context.previousLockers)
      }
      if (context?.previousLockersInfinite) {
        queryClient.setQueryData(
          [ "lockers-infinite" ],
          context.previousLockersInfinite,
        )
      }
      if (context?.previousRentals) {
        queryClient.setQueryData([ "locker-rentals" ], context.previousRentals)
      }
      if (context?.previousRentalsInfinite) {
        queryClient.setQueryData(
          [ "locker-rentals-infinite" ],
          context.previousRentalsInfinite,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
