import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { lockerConfigSchema } from "@/schemas/locker"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { PaginatedLockersResponse } from "@/backend/actions/locker/find-many"
import type { Locker } from "@/schemas/drizzle-schema"
import type { LockerConfig } from "@/schemas/locker"

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
    mutationKey: [ "update-locker", id ],
    mutationFn: async (payload: Partial<LockerConfig>) => {
      const sanitizedData = sanitizer<Partial<LockerConfig>>(
        payload,
        lockerConfigSchema.partial(),
      )
      return await updateLocker(id, sanitizedData)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [ "locker", id ] })
      await queryClient.cancelQueries({ queryKey: [ "lockers" ] })
      await queryClient.cancelQueries({ queryKey: [ "lockers-infinite" ] })
      await queryClient.cancelQueries({ queryKey: [ "locker-rentals" ] })
      await queryClient.cancelQueries({ queryKey: [ "locker-rentals-infinite" ] })

      const previousLocker = queryClient.getQueryData<Locker>([ "locker", id ])
      const previousLockers = queryClient.getQueryData([ "lockers" ])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])
      const previousRentals = queryClient.getQueryData([ "locker-rentals" ])
      const previousRentalsInfinite = queryClient.getQueryData([
        "locker-rentals-infinite",
      ])

      return {
        previousLocker,
        previousLockers,
        previousLockersInfinite,
        previousRentals,
        previousRentalsInfinite,
      }
    },
    onSuccess: async (updatedLocker: Locker) => {
      queryClient.setQueryData([ "locker", id ], updatedLocker)

      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: [ "lockers" ] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.map((locker) =>
              locker.id === id ? updatedLocker : locker,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: [ "lockers-infinite" ] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedLockersResponse) => ({
              ...page,
              data: page.data.map((locker) =>
                locker.id === id ? updatedLocker : locker,
              ),
            })),
          }
        },
      )

      if (updatedLocker.lockerStatus) {
        queryClient.setQueriesData(
          { queryKey: [ "locker-rentals" ] },
          (oldData: any) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((rental: any) =>
                rental.lockerId === id
                  ? { ...rental, locker: updatedLocker }
                  : rental,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: [ "locker-rentals-infinite" ] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.map((rental: any) =>
                  rental.lockerId === id
                    ? { ...rental, locker: updatedLocker }
                    : rental,
                ),
              })),
            }
          },
        )
      }
    },
    onError: (error, _payload, context) => {
      if (context?.previousLocker) {
        queryClient.setQueryData([ "locker", id ], context.previousLocker)
      }
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
      router.push("/locker-rental")
    },
  })
}
