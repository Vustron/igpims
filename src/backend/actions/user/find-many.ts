import { queryOptions } from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"

import { useQuery } from "@tanstack/react-query"

import type { QueryClient } from "@tanstack/react-query"
import type { User } from "@/schemas/drizzle-schema"

export async function findManyUser(): Promise<User[]> {
  return await api.get<User[]>("auth/find-many")
}

export async function preFindManyUser() {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["users"],
      queryFn: async () => await findManyUser(),
    })
  }
}

export const useFindManyUser = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => await findManyUser(),
  })
}
