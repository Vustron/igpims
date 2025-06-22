import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { PaginatedLockersResponse } from "../locker/find-many"

export async function deleteLockerById(id: string) {
  return api.delete("lockers/delete-locker-by-id", {
    params: { id },
  })
}

export const useDeleteLockerById = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-locker", id],
    mutationFn: async () => {
      return await deleteLockerById(id)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["lockers"] }),
        queryClient.cancelQueries({ queryKey: ["lockers-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rentals"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rentals-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["locker", id] }),
      ])

      const previousLockers =
        queryClient.getQueryData<PaginatedLockersResponse>(["lockers"])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])
      const previousRentals = queryClient.getQueryData(["locker-rentals"])
      const previousRentalsInfinite = queryClient.getQueryData([
        "locker-rentals-infinite",
      ])
      const previousLocker = queryClient.getQueryData(["locker", id])

      if (previousLockers) {
        queryClient.setQueryData<PaginatedLockersResponse>(
          ["lockers"],
          (old) => ({
            ...old!,
            data: old!.data.filter((locker) => locker.id !== id),
            meta: {
              ...old!.meta,
              totalItems: Math.max(0, old!.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil((old!.meta.totalItems - 1) / old!.meta.limit),
              ),
            },
          }),
        )
      }

      queryClient.setQueriesData(
        { queryKey: ["lockers-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedLockersResponse) => {
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

      queryClient.setQueriesData(
        { queryKey: ["locker-rentals"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.filter((rental: any) => rental.lockerId !== id),
          }
        },
      )

      queryClient.removeQueries({ queryKey: ["locker", id] })

      return {
        previousLocker,
        previousLockers,
        previousLockersInfinite,
        previousRentals,
        previousRentalsInfinite,
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousLockers) {
        queryClient.setQueryData(["lockers"], context.previousLockers)
      }
      if (context?.previousLockersInfinite) {
        queryClient.setQueryData(
          ["lockers-infinite"],
          context.previousLockersInfinite,
        )
      }
      if (context?.previousRentals) {
        queryClient.setQueryData(["locker-rentals"], context.previousRentals)
      }
      if (context?.previousRentalsInfinite) {
        queryClient.setQueryData(
          ["locker-rentals-infinite"],
          context.previousRentalsInfinite,
        )
      }
      if (context?.previousLocker) {
        queryClient.setQueryData(["locker", id], context.previousLocker)
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
