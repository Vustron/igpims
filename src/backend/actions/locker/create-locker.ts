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
    mutationKey: ["create-locker"],
    mutationFn: async (payload: LockerType) => {
      const sanitizedData = sanitizer<LockerType>(payload, lockerSchema)
      return await createLocker(sanitizedData)
    },

    onSuccess: async (newLocker: Locker) => {
      // Cancel any ongoing queries for lockers
      await queryClient.cancelQueries({ queryKey: ["lockers"] })

      // Update paginated data in cache
      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: ["lockers"] },
        (oldData) => {
          if (!oldData) return undefined

          // For the first page, add the new locker to the start of the list
          if (oldData.meta.page === 1) {
            return {
              ...oldData,
              data: [newLocker, ...oldData.data],
              meta: {
                ...oldData.meta,
                totalItems: oldData.meta.totalItems + 1,
                totalPages: Math.ceil(
                  (oldData.meta.totalItems + 1) / oldData.meta.limit,
                ),
              },
            }
          }

          // For other pages, just update the metadata
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
        { queryKey: ["lockers-infinite"] },
        (oldData: any) => {
          if (!oldData) return undefined

          const pages = oldData.pages || []
          if (pages.length === 0) return oldData

          // Add to first page of infinite query
          const newPages = [...pages]
          newPages[0] = {
            ...newPages[0],
            data: [newLocker, ...newPages[0].data],
            meta: {
              ...newPages[0].meta,
              totalItems: newPages[0].meta.totalItems + 1,
              totalPages: Math.ceil(
                (newPages[0].meta.totalItems + 1) / newPages[0].meta.limit,
              ),
            },
          }

          return {
            ...oldData,
            pages: newPages,
          }
        },
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lockers"] })
      queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] })
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
