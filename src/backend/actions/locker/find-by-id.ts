import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"
import { Locker } from "@/validation/locker"

export async function findLockerById(id: string): Promise<Locker> {
  return api.get<Locker>("lockers/find-by-id", {
    params: { id },
  })
}

export async function preFindLockerById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["locker", id],
      queryFn: async () => await findLockerById(id),
    })
  }
}

export const useFindLockerById = (id: string) => {
  return useSuspenseQuery<Locker>({
    queryKey: ["locker", id],
    queryFn: async () => await findLockerById(id),
  })
}
