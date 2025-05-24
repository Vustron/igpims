import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"

import type { LockerRental } from "@/schemas/drizzle-schema"
import type { QueryClient } from "@tanstack/react-query"

export async function findRentByLockerId(
  id: string,
): Promise<LockerRental | null> {
  try {
    const response = await api.get<LockerRental>(
      "locker-rentals/find-by-locker-id",
      {
        params: { id },
      },
    )
    return response
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export async function preFindRentByLockerId(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["locker-rental", id],
      queryFn: async () => await findRentByLockerId(id),
    })
  }
}

export const useFindRentByLockerId = (id: string) => {
  return useSuspenseQuery<LockerRental | null>({
    queryKey: ["locker-rental", id],
    queryFn: async () => await findRentByLockerId(id),
  })
}
