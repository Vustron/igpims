import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { lockerSchema } from "@/schemas/locker"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { PaginatedLockersResponse } from "@/backend/actions/locker/find-many"
import type { Locker as LockerType } from "@/schemas/locker"
import type { Locker } from "@/schemas/drizzle-schema"

export async function createLocker(payload: LockerType): Promise<Locker> {
  return api.post<LockerType, Locker>("lockers/create-locker", payload)
}

export const useCreateLocker = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: [ "create-locker" ],
    mutationFn: async (payload: LockerType) => {
      const sanitizedData = sanitizer<LockerType>(payload, lockerSchema)
      return await createLocker(sanitizedData)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [ "lockers" ] })
      await queryClient.cancelQueries({ queryKey: [ "lockers-infinite" ] })

      const previousLockers = queryClient.getQueryData([ "lockers" ])
      const previousLockersInfinite = queryClient.getQueryData([ "lockers-infinite" ])

      return {
        previousLockers,
        previousLockersInfinite,
      }
    },
    onSuccess: async (newLocker: Locker) => {
      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: [ "lockers" ] },
        (oldData) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [ newLocker, ...oldData.data.slice(0, oldData.meta.limit - 1) ]
            const newTotalItems = oldData.meta.totalItems + 1

            return {
              ...oldData,
              data: updatedData,
              meta: {
                ...oldData.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(newTotalItems / oldData.meta.limit),
                hasNextPage: oldData.meta.page < Math.ceil(newTotalItems / oldData.meta.limit),
                hasPrevPage: oldData.meta.page > 1,
              },
            }
          }

          return {
            ...oldData,
            meta: {
              ...oldData.meta,
              totalItems: oldData.meta.totalItems + 1,
              totalPages: Math.ceil((oldData.meta.totalItems + 1) / oldData.meta.limit),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: [ "lockers-infinite" ] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [ ...oldData.pages ]

          if (updatedPages.length > 0 && updatedPages[ 0 ]?.data) {
            const firstPage = { ...updatedPages[ 0 ] }
            const newTotalItems = firstPage.meta.totalItems + 1

            updatedPages[ 0 ] = {
              ...firstPage,
              data: [ newLocker, ...firstPage.data ],
              meta: {
                ...firstPage.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(newTotalItems / firstPage.meta.limit),
                hasNextPage: firstPage.meta.page < Math.ceil(newTotalItems / firstPage.meta.limit),
                hasPrevPage: firstPage.meta.page > 1,
              },
            }
          }

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousLockers) {
        queryClient.setQueryData([ "lockers" ], context.previousLockers)
      }
      if (context?.previousLockersInfinite) {
        queryClient.setQueryData([ "lockers-infinite" ], context.previousLockersInfinite)
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
