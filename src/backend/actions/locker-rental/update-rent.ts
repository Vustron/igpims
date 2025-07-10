import { LockerRental } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { UpdateRentalData, updateRentalSchema } from "@/validation/rental"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedRentalsResponse } from "../locker-rental/find-many"

export async function updateRent(
  id: string,
  payload: Partial<UpdateRentalData>,
): Promise<LockerRental> {
  return api.patch<Partial<UpdateRentalData>, LockerRental>(
    "locker-rentals/update-rent",
    payload,
    {
      params: { id },
    },
  )
}

export const useUpdateRent = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-rent", id],
    mutationFn: async (payload: Partial<UpdateRentalData>) => {
      const sanitizedData = sanitizer<Partial<UpdateRentalData>>(
        payload,
        updateRentalSchema.partial(),
      )
      return await updateRent(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["locker-rentals"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rentals-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rental", id] }),
        queryClient.cancelQueries({ queryKey: ["lockers"] }),
        queryClient.cancelQueries({ queryKey: ["lockers-infinite"] }),
      ])

      const previousRental = queryClient.getQueryData<LockerRental>([
        "locker-rental",
        id,
      ])
      const previousRentals = queryClient.getQueryData(["locker-rentals"])
      const previousRentalsInfinite = queryClient.getQueryData([
        "locker-rentals-infinite",
      ])
      const previousLockers = queryClient.getQueryData(["lockers"])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])

      const currentLockerId = previousRental?.lockerId
      const newLockerId = updatedData.lockerId
      const isChangingLocker = newLockerId && newLockerId !== currentLockerId

      if (previousRental) {
        const optimisticRental: LockerRental = {
          ...previousRental,
          ...updatedData,
        }

        queryClient.setQueryData(["locker-rental", id], optimisticRental)

        queryClient.setQueriesData<PaginatedRentalsResponse>(
          { queryKey: ["locker-rentals"] },
          (oldData) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((rental) =>
                rental.id === id ? optimisticRental : rental,
              ),
            }
          },
        )

        if (isChangingLocker) {
          if (currentLockerId) {
            queryClient.setQueryData(
              ["locker", currentLockerId],
              (oldData: any) => {
                if (!oldData) return oldData
                return {
                  ...oldData,
                  lockerStatus: "available",
                  updatedAt: Date.now(),
                }
              },
            )

            queryClient.setQueriesData(
              { queryKey: ["lockers"] },
              (oldData: any) => {
                if (!oldData?.data) return oldData

                return {
                  ...oldData,
                  data: oldData.data.map((locker: any) => {
                    if (locker.id === currentLockerId) {
                      return {
                        ...locker,
                        lockerStatus: "available",
                      }
                    }
                    return locker
                  }),
                }
              },
            )
          }

          queryClient.setQueryData(["locker", newLockerId], (oldData: any) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              lockerStatus: "occupied",
            }
          })

          queryClient.setQueriesData(
            { queryKey: ["lockers"] },
            (oldData: any) => {
              if (!oldData?.data) return oldData

              return {
                ...oldData,
                data: oldData.data.map((locker: any) => {
                  if (locker.id === newLockerId) {
                    return {
                      ...locker,
                      lockerStatus: "occupied",
                    }
                  }
                  return locker
                }),
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
                  data: page.data.map((locker: any) => {
                    if (locker.id === newLockerId) {
                      return {
                        ...locker,
                        lockerStatus: "occupied",
                      }
                    }
                    if (currentLockerId && locker.id === currentLockerId) {
                      return {
                        ...locker,
                        lockerStatus: "available",
                      }
                    }
                    return locker
                  }),
                })),
              }
            },
          )
        }
      }

      return {
        previousRental,
        previousRentals,
        previousRentalsInfinite,
        previousLockers,
        previousLockersInfinite,
        currentLockerId,
        newLockerId: isChangingLocker ? newLockerId : undefined,
      }
    },
    onSuccess: async (updatedRental: LockerRental, _variables, _context) => {
      queryClient.setQueryData(["locker-rental", id], updatedRental)

      queryClient.setQueriesData<PaginatedRentalsResponse>(
        { queryKey: ["locker-rentals"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((rental) =>
              rental.id === id ? updatedRental : rental,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["locker-rentals-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((rental: any) =>
                rental.id === id ? updatedRental : rental,
              ),
            })),
          }
        },
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["locker-rentals"] }),
        queryClient.invalidateQueries({
          queryKey: ["locker-rentals-infinite"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["locker-rental", updatedRental.id],
        }),
        queryClient.invalidateQueries({ queryKey: ["lockers"] }),
        queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] }),
        queryClient.invalidateQueries({
          queryKey: ["locker", updatedRental.lockerId],
        }),
      ])
    },
    onError: (error, _variables, context) => {
      if (context?.previousRental) {
        queryClient.setQueryData(["locker-rental", id], context.previousRental)
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
      if (context?.previousLockers) {
        queryClient.setQueryData(["lockers"], context.previousLockers)
      }
      if (context?.previousLockersInfinite) {
        queryClient.setQueryData(
          ["lockers-infinite"],
          context.previousLockersInfinite,
        )
      }
      if (context?.currentLockerId) {
        queryClient.setQueryData(
          ["locker", context.currentLockerId],
          (oldData: any) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              lockerStatus: "occupied",
              updatedAt: context.previousRental?.updatedAt,
            }
          },
        )
      }
      if (context?.newLockerId) {
        queryClient.setQueryData(
          ["locker", context.newLockerId],
          (oldData: any) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              lockerStatus: "available",
              updatedAt: context.previousRental?.updatedAt,
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
