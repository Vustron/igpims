import { LockerRental } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedRentalsResponse } from "../locker-rental/find-many"

export async function deleteRent(rentalId: string) {
  return api.delete("locker-rentals/delete-rent-by-id", {
    params: { id: rentalId },
  })
}

export const useDeleteRent = (rentalId: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-rent", rentalId],
    mutationFn: async () => {
      return await deleteRent(rentalId)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["locker-rentals"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rentals-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rental", rentalId] }),
        queryClient.cancelQueries({ queryKey: ["lockers"] }),
        queryClient.cancelQueries({ queryKey: ["lockers-infinite"] }),
      ])

      const currentRental = queryClient.getQueryData<LockerRental>([
        "locker-rental",
        rentalId,
      ])
      const lockerId = currentRental?.lockerId

      const previousRentals = queryClient.getQueryData(["locker-rentals"])
      const previousRentalsInfinite = queryClient.getQueryData([
        "locker-rentals-infinite",
      ])
      const previousLockers = queryClient.getQueryData(["lockers"])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])
      const previousRental = queryClient.getQueryData([
        "locker-rental",
        rentalId,
      ])

      queryClient.setQueriesData<PaginatedRentalsResponse>(
        { queryKey: ["locker-rentals"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((rental) => rental.id !== rentalId),
            meta: {
              ...oldData.meta,
              totalItems: Math.max(0, oldData.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil((oldData.meta.totalItems - 1) / oldData.meta.limit),
              ),
            },
          }
        },
      )

      if (lockerId) {
        queryClient.setQueriesData(
          { queryKey: ["lockers"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((locker: any) =>
                locker.id === lockerId
                  ? {
                      ...locker,
                      lockerStatus: "available",
                      updatedAt: Date.now(),
                    }
                  : locker,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: ["lockers-infinite"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.map((locker: any) =>
                  locker.id === lockerId
                    ? {
                        ...locker,
                        lockerStatus: "available",
                        updatedAt: Date.now(),
                      }
                    : locker,
                ),
              })),
            }
          },
        )

        queryClient.setQueryData(["locker", lockerId], (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            lockerStatus: "available",
            updatedAt: Date.now(),
          }
        })
      }

      queryClient.removeQueries({ queryKey: ["locker-rental", rentalId] })

      return {
        previousRentals,
        previousRentalsInfinite,
        previousLockers,
        previousLockersInfinite,
        previousRental,
        lockerId,
      }
    },
    onSuccess: async (_data, _variables, _context) => {
      queryClient.setQueriesData(
        { queryKey: ["locker-rentals-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter(
                (rental: LockerRental) => rental.id !== rentalId,
              ),
              meta: {
                ...page.meta,
                totalItems: Math.max(0, page.meta.totalItems - 1),
                totalPages: Math.max(
                  1,
                  Math.ceil((page.meta.totalItems - 1) / page.meta.limit),
                ),
              },
            })),
          }
        },
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["locker-rentals"] }),
        queryClient.invalidateQueries({
          queryKey: ["locker-rentals-infinite"],
        }),
        queryClient.invalidateQueries({ queryKey: ["lockers"] }),
        queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] }),
      ])
    },
    onError: (error, _variables, context) => {
      if (context?.previousRentals) {
        queryClient.setQueryData(["locker-rentals"], context.previousRentals)
      }
      if (context?.previousRentalsInfinite) {
        queryClient.setQueryData(
          ["locker-rentals-infinite"],
          context.previousRentalsInfinite,
        )
      }
      if (context?.previousLockers) {
        queryClient.setQueryData(["lockers"], context.previousLockers)
      }
      if (context?.previousLockersInfinite) {
        queryClient.setQueryData(
          ["lockers-infinite"],
          context.previousLockersInfinite,
        )
      }
      if (context?.previousRental) {
        queryClient.setQueryData(
          ["locker-rental", rentalId],
          context.previousRental,
        )
      }
      if (context?.lockerId) {
        queryClient.setQueryData(
          ["locker", context.lockerId],
          (oldData: any) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              lockerStatus: "occupied",
            }
          },
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
