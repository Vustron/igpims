import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedLockersResponse } from "@/backend/actions/locker/find-many"
import { Locker, LockerRental } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { LockerConfig, lockerConfigSchema } from "@/validation/locker"

interface LockerWithRental extends Locker {
  rental?: LockerRental
  rentalHistory?: LockerRental[]
}

export async function updateLocker(
  id: string,
  payload: Partial<LockerConfig>,
): Promise<Locker> {
  return api.patch<Partial<LockerConfig>, Locker>(
    "lockers/update-locker",
    payload,
    {
      params: { id },
    },
  )
}

export const useUpdateLocker = (id: string) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ["update-locker", id],
    mutationFn: async (payload: Partial<LockerConfig>) => {
      const sanitizedData = sanitizer<Partial<LockerConfig>>(
        payload,
        lockerConfigSchema.partial(),
      )
      return await updateLocker(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["locker", id] }),
        queryClient.cancelQueries({ queryKey: ["lockers"] }),
        queryClient.cancelQueries({ queryKey: ["lockers-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rentals"] }),
        queryClient.cancelQueries({ queryKey: ["locker-rentals-infinite"] }),
      ])
      const previousLocker = queryClient.getQueryData<LockerWithRental>([
        "locker",
        id,
      ])
      const previousLockers = queryClient.getQueryData(["lockers"])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])
      const previousRentals = queryClient.getQueryData(["locker-rentals"])
      const previousRentalsInfinite = queryClient.getQueryData([
        "locker-rentals-infinite",
      ])

      if (previousLocker) {
        const updatedLocker = {
          ...previousLocker,
          ...updatedData,
          lockerRentalPrice: updatedData.lockerRentalPrice
            ? Number(updatedData.lockerRentalPrice)
            : previousLocker.lockerRentalPrice,
          updatedAt: Date.now(),
        } as unknown as LockerWithRental

        if (previousLocker.rental && updatedData.rentalId) {
          updatedLocker.rental = {
            ...previousLocker.rental,
            ...(updatedData.renterId && { renterId: updatedData.renterId }),
            ...(updatedData.renterName && {
              renterName: updatedData.renterName,
            }),
            ...(updatedData.courseAndSet && {
              courseAndSet: updatedData.courseAndSet,
            }),
            ...(updatedData.renterEmail && {
              renterEmail: updatedData.renterEmail,
            }),
            ...(updatedData.rentalStatus && {
              rentalStatus: updatedData.rentalStatus,
            }),
            ...(updatedData.paymentStatus && {
              paymentStatus: updatedData.paymentStatus,
            }),
            ...(updatedData.dateRented && {
              dateRented:
                typeof updatedData.dateRented === "number"
                  ? updatedData.dateRented
                  : new Date(updatedData.dateRented).getTime(),
            }),
            ...(updatedData.dateDue && {
              dateDue:
                typeof updatedData.dateDue === "number"
                  ? updatedData.dateDue
                  : new Date(updatedData.dateDue).getTime(),
            }),
            updatedAt: Date.now(),
          }
        }

        queryClient.setQueryData(["locker", id], updatedLocker)
      }

      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: ["lockers"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((locker: any) =>
              locker.id === id
                ? {
                    ...locker,
                    ...updatedData,
                    lockerRentalPrice: updatedData.lockerRentalPrice
                      ? Number(updatedData.lockerRentalPrice)
                      : locker.lockerRentalPrice,
                    updatedAt: Date.now(),
                    rental:
                      previousLocker?.rental && updatedData.rentalId
                        ? {
                            ...previousLocker.rental,
                            ...(updatedData.renterId && {
                              renterId: updatedData.renterId,
                            }),
                            ...(updatedData.renterName && {
                              renterName: updatedData.renterName,
                            }),
                            ...(updatedData.courseAndSet && {
                              courseAndSet: updatedData.courseAndSet,
                            }),
                            ...(updatedData.renterEmail && {
                              renterEmail: updatedData.renterEmail,
                            }),
                            ...(updatedData.rentalStatus && {
                              rentalStatus: updatedData.rentalStatus,
                            }),
                            ...(updatedData.paymentStatus && {
                              paymentStatus: updatedData.paymentStatus,
                            }),
                            ...(updatedData.dateRented && {
                              dateRented:
                                typeof updatedData.dateRented === "number"
                                  ? updatedData.dateRented
                                  : new Date(updatedData.dateRented).getTime(),
                            }),
                            ...(updatedData.dateDue && {
                              dateDue:
                                typeof updatedData.dateDue === "number"
                                  ? updatedData.dateDue
                                  : new Date(updatedData.dateDue).getTime(),
                            }),
                            updatedAt: Date.now(),
                          }
                        : locker.rental,
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
            pages: oldData.pages.map((page: PaginatedLockersResponse) => ({
              ...page,
              data: page.data.map((locker: any) =>
                locker.id === id
                  ? {
                      ...locker,
                      ...updatedData,
                      lockerRentalPrice: updatedData.lockerRentalPrice
                        ? Number(updatedData.lockerRentalPrice)
                        : locker.lockerRentalPrice,
                      updatedAt: Date.now(),
                      rental:
                        previousLocker?.rental && updatedData.rentalId
                          ? {
                              ...previousLocker.rental,
                              ...(updatedData.renterId && {
                                renterId: updatedData.renterId,
                              }),
                              ...(updatedData.renterName && {
                                renterName: updatedData.renterName,
                              }),
                              ...(updatedData.courseAndSet && {
                                courseAndSet: updatedData.courseAndSet,
                              }),
                              ...(updatedData.renterEmail && {
                                renterEmail: updatedData.renterEmail,
                              }),
                              ...(updatedData.rentalStatus && {
                                rentalStatus: updatedData.rentalStatus,
                              }),
                              ...(updatedData.paymentStatus && {
                                paymentStatus: updatedData.paymentStatus,
                              }),
                              ...(updatedData.dateRented && {
                                dateRented:
                                  typeof updatedData.dateRented === "number"
                                    ? updatedData.dateRented
                                    : new Date(
                                        updatedData.dateRented,
                                      ).getTime(),
                              }),
                              ...(updatedData.dateDue && {
                                dateDue:
                                  typeof updatedData.dateDue === "number"
                                    ? updatedData.dateDue
                                    : new Date(updatedData.dateDue).getTime(),
                              }),
                              updatedAt: Date.now(),
                            }
                          : locker.rental,
                    }
                  : locker,
              ),
            })),
          }
        },
      )

      return {
        previousLocker,
        previousLockers,
        previousLockersInfinite,
        previousRentals,
        previousRentalsInfinite,
      }
    },
    onSuccess: (updatedLocker: Locker) => {
      const currentData = queryClient.getQueryData<LockerWithRental>([
        "locker",
        id,
      ])

      const mergedData = {
        ...updatedLocker,
        rental: currentData?.rental,
        rentalHistory: currentData?.rentalHistory,
      } as LockerWithRental

      queryClient.setQueryData(["locker", id], mergedData)

      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: ["lockers"] },
        (oldData) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((locker) =>
              locker.id === id ? mergedData : locker,
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
            pages: oldData.pages.map((page: PaginatedLockersResponse) => ({
              ...page,
              data: page.data.map((locker) =>
                locker.id === id ? mergedData : locker,
              ),
            })),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["locker-rentals"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((rental: any) =>
              rental.lockerId === id
                ? {
                    ...rental,
                    locker: mergedData,
                    ...(mergedData.rental && {
                      dateRented: mergedData.rental.dateRented,
                      dateDue: mergedData.rental.dateDue,
                    }),
                  }
                : rental,
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
                rental.lockerId === id
                  ? {
                      ...rental,
                      locker: mergedData,
                      ...(mergedData.rental && {
                        dateRented: mergedData.rental.dateRented,
                        dateDue: mergedData.rental.dateDue,
                      }),
                    }
                  : rental,
              ),
            })),
          }
        },
      )
    },
    onError: (error, _payload, context) => {
      if (context?.previousLocker) {
        queryClient.setQueryData(["locker", id], context.previousLocker)
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
      if (context?.previousRentals) {
        queryClient.setQueryData(["locker-rentals"], context.previousRentals)
      }
      if (context?.previousRentalsInfinite) {
        queryClient.setQueryData(
          ["locker-rentals-infinite"],
          context.previousRentalsInfinite,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.back()
      router.refresh()
    },
  })
}
