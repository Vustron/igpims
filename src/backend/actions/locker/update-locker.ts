import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { lockerConfigSchema } from "@/schemas/locker"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { LockerConfig } from "@/schemas/locker"
import type { Locker } from "@/schemas/drizzle-schema"

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
    onMutate: async (payload: Partial<LockerConfig>) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["locker", id] })
      await queryClient.cancelQueries({ queryKey: ["lockers"] })
      await queryClient.cancelQueries({ queryKey: ["lockers-infinite"] })

      // Snapshot the previous values
      const previousLocker = queryClient.getQueryData<Locker>(["locker", id])
      const previousLockers = queryClient.getQueryData(["lockers"])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])

      // Optimistically update the single locker
      if (previousLocker) {
        const optimisticLocker: Locker = {
          ...previousLocker,
          ...payload,
          updatedAt: new Date(),
        }
        queryClient.setQueryData(["locker", id], optimisticLocker)
      }

      // Optimistically update the lockers list
      if (previousLockers && Array.isArray(previousLockers)) {
        const updatedLockers = previousLockers.map((locker: Locker) =>
          locker.id === id
            ? { ...locker, ...payload, updatedAt: new Date() }
            : locker,
        )
        queryClient.setQueryData(["lockers"], updatedLockers)
      }

      // Optimistically update infinite queries
      if (previousLockersInfinite) {
        queryClient.setQueryData(["lockers-infinite"], (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((locker: Locker) =>
                locker.id === id
                  ? { ...locker, ...payload, updatedAt: new Date() }
                  : locker,
              ),
            })),
          }
        })
      }

      // Return context for rollback
      return {
        previousLocker,
        previousLockers,
        previousLockersInfinite,
      }
    },
    onSuccess: async (updatedLocker: Locker) => {
      queryClient.setQueryData(["locker", id], updatedLocker)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["rentals"] }),
        queryClient.invalidateQueries({ queryKey: ["rentals-infinite"] }),
      ])
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

      catchError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["locker", id] })
      queryClient.invalidateQueries({ queryKey: ["lockers"] })
      queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] })
      router.push("/locker-rental")
    },
  })
}
