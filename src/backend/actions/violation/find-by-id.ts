import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"
import { Violation } from "@/validation/violation"

export async function findViolationById(id: string): Promise<Violation> {
  return api.get<Violation>("violations/find-by-id", {
    params: { id },
  })
}

export async function preFindViolationById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["violation", id],
      queryFn: async () => await findViolationById(id),
    })
  }
}

export const useFindViolationById = (id: string) => {
  return useSuspenseQuery<Violation>({
    queryKey: ["violation", id],
    queryFn: async () => await findViolationById(id),
  })
}
