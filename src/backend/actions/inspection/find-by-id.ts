import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"
import { Inspection } from "@/validation/inspection"

export async function findInspectionById(id: string): Promise<Inspection> {
  return api.get<Inspection>("inspections/find-by-id", {
    params: { id },
  })
}

export async function preFindInspectionById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["inspection", id],
      queryFn: async () => await findInspectionById(id),
    })
  }
}

export const useFindInspectionById = (id: string) => {
  return useQuery({
    queryKey: ["inspection", id],
    queryFn: async () => await findInspectionById(id),
  })
}
