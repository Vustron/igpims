import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { User } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"

export async function findUserById(id: string): Promise<User> {
  return await api.get<User>("auth/find-by-id", {
    params: { id },
  })
}

export async function preFindUserById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["user", id],
      queryFn: async () => await findUserById(id),
    })
  }
}

export const useFindAccountById = (id: string) => {
  return useSuspenseQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => await findUserById(id),
  })
}
