import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { lockerSchema } from "@/schemas/locker"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { Locker as LockerType } from "@/schemas/locker"
import type { Locker } from "@/schemas/drizzle-schema"

export async function updateLocker(
  id: string,
  payload: Partial<LockerType>,
): Promise<Locker> {
  return api.patch<Partial<LockerType>, Locker>(
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
    mutationFn: async (payload: Partial<LockerType>) => {
      const sanitizedData = sanitizer<Partial<LockerType>>(
        payload,
        lockerSchema.partial(),
      )
      return await updateLocker(id, sanitizedData)
    },
    onSuccess: async (updatedLocker: Locker) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lockers"] }),
        queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] }),
        queryClient.invalidateQueries({ queryKey: ["locker", id] }),
      ])
      queryClient.setQueryData(["locker", id], updatedLocker)
    },
    onSettled: () => {
      router.push("/locker-rental")
    },
    onError: (error) => catchError(error),
  })
}
