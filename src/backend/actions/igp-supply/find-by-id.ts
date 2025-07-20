import { IgpSupply } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export type IgpSupplyWithRelations = IgpSupply & {
  igp?: {
    id: string
    igpName: string
    igpType: string
    costPerItem: number
  }
}

export async function findIgpSupplyById(
  id: string,
): Promise<IgpSupplyWithRelations> {
  return api.get<IgpSupplyWithRelations>("igp-supplies/find-by-id", {
    params: { id },
  })
}

export async function preFindIgpSupplyById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["igp-supply", id],
      queryFn: async () => await findIgpSupplyById(id),
    })
  }
}

export const useFindIgpSupplyById = (id: string) => {
  return useQuery({
    queryKey: ["igp-supply", id],
    queryFn: async () => await findIgpSupplyById(id),
    enabled: !!id,
  })
}
