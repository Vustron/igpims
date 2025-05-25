import { createRentalSchema } from "@/schemas/rental"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { LockerRental } from "@/schemas/drizzle-schema"
import type { CreateRentalData } from "@/schemas/rental"

export async function updateRental(
  id: string,
  payload: Partial<CreateRentalData>,
): Promise<LockerRental> {
  return api.patch<Partial<CreateRentalData>, LockerRental>(
    "locker-rental/update-rental",
    payload,
    {
      params: { id },
    },
  )
}

export const useUpdateRental = (id: string) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ["update-rental", id],
    mutationFn: async (payload: Partial<CreateRentalData>) => {
      const sanitizedData = sanitizer<Partial<CreateRentalData>>(
        payload,
        createRentalSchema.partial(),
      )
      return await updateRental(id, sanitizedData)
    },
    onSuccess: async (updatedRental: LockerRental) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["rentals"] }),
        queryClient.invalidateQueries({ queryKey: ["rentals-infinite"] }),
        queryClient.invalidateQueries({ queryKey: ["rental", id] }),
        queryClient.invalidateQueries({ queryKey: ["lockers"] }),
        queryClient.invalidateQueries({ queryKey: ["lockers-infinite"] }),
      ])
      queryClient.setQueryData(["rental", id], updatedRental)
    },
    onSettled: () => {
      router.push("/locker-rental")
    },
    onError: (error) => catchError(error),
  })
}
