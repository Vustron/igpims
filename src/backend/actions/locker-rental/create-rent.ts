import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { LockerRental } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { CreateRentalData, createRentalSchema } from "@/validation/rental"
import { PaginatedRentalsResponse } from "../locker-rental/find-many"

export async function createRent(
  payload: CreateRentalData,
): Promise<LockerRental> {
  return api.post<CreateRentalData, LockerRental>(
    "locker-rentals/create-rent",
    payload,
  )
}

export const useCreateRent = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-rent"],
    mutationFn: async (payload: CreateRentalData) => {
      const validatedData = createRentalSchema.parse(payload)
      return await createRent(validatedData)
    },
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["locker-rentals"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rentals-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["lockers"] }),
        queryClient.cancelQueries({ queryKey: ["locker", payload.lockerId] }),
        queryClient.cancelQueries({ queryKey: ["lockers-infinite"] }),
      ])

      const previousRentals = queryClient.getQueryData(["locker-rentals"])
      const previousRentalsInfinite = queryClient.getQueryData([
        "locker-rentals-infinite",
      ])
      const previousLockers = queryClient.getQueryData(["lockers"])
      const previousLocker = queryClient.getQueryData([
        "locker",
        payload.lockerId,
      ])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])

      return {
        previousRentals,
        previousRentalsInfinite,
        previousLockers,
        previousLocker,
        previousLockersInfinite,
        lockerId: payload.lockerId,
      }
    },
    onSuccess: async (newRental: LockerRental, _variables, context) => {
      queryClient.setQueryData(["locker-rental", newRental.id], newRental)

      queryClient.setQueriesData(
        { queryKey: ["locker-rentals"] },
        (oldData: PaginatedRentalsResponse | undefined) => {
          if (!oldData?.data) return oldData

          const exists = oldData.data.some(
            (rental) => rental.id === newRental.id,
          )
          if (exists) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [
              newRental,
              ...oldData.data.slice(0, oldData.meta.limit - 1),
            ]
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
          }

          return {
            ...oldData,
            meta: {
              ...oldData.meta,
              totalItems: oldData.meta.totalItems + 1,
              totalPages: Math.ceil(
                (oldData.meta.totalItems + 1) / oldData.meta.limit,
              ),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["locker-rentals-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]

          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            const exists = updatedPages[0].data.some(
              (rental: LockerRental) => rental.id === newRental.id,
            )

            if (!exists) {
              const firstPage = { ...updatedPages[0] }
              const newTotalItems = firstPage.meta.totalItems + 1

              updatedPages[0] = {
                ...firstPage,
                data: [newRental, ...firstPage.data],
                meta: {
                  ...firstPage.meta,
                  totalItems: newTotalItems,
                  totalPages: Math.ceil(newTotalItems / firstPage.meta.limit),
                  hasNextPage:
                    firstPage.meta.page <
                    Math.ceil(newTotalItems / firstPage.meta.limit),
                  hasPrevPage: firstPage.meta.page > 1,
                },
              }
            }
          }

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

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

        queryClient.setQueriesData(
          { queryKey: ["lockers"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((locker: any) =>
                locker.id === context.lockerId
                  ? {
                      ...locker,
                      lockerStatus: "occupied",
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
                  locker.id === context.lockerId
                    ? {
                        ...locker,
                        lockerStatus: "occupied",
                      }
                    : locker,
                ),
              })),
            }
          },
        )
      }
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
      if (context?.lockerId) {
        queryClient.setQueryData(
          ["locker", context.lockerId],
          (oldData: any) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              lockerStatus: "available",
            }
          },
        )
      }

      catchError(error)
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["locker-rentals"] }),
        queryClient.invalidateQueries({
          queryKey: ["locker-rentals-infinite"],
        }),
        queryClient.invalidateQueries({ queryKey: ["lockers"] }),
        queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] }),
      ])
      router.refresh()
    },
  })
}
