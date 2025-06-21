import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"
import { LockerRentalWithLocker } from "@/interfaces/locker"

export async function findRentById(
  id: string,
): Promise<LockerRentalWithLocker> {
  return api.get<LockerRentalWithLocker>("locker-rentals/find-by-id", {
    params: { id },
  })
}

export async function preFindRentById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["locker-rental", id],
      queryFn: async () => await findRentById(id),
    })
  }
}

export const useFindRentById = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["locker-rental", id],
    queryFn: async () => await findRentById(id),
  })
}
