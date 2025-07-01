import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { WaterVendo } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"

export async function findWaterVendoById(id: string): Promise<WaterVendo> {
  return api.get<WaterVendo>("water-vendo/find-by-id", {
    params: { id },
  })
}

export async function preFindWaterVendoById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["water-vendo", id],
      queryFn: async () => await findWaterVendoById(id),
    })
  }
}

export const useFindWaterVendoById = (id: string) => {
  return useQuery<WaterVendo>({
    queryKey: ["water-vendo", id],
    queryFn: async () => await findWaterVendoById(id),
    enabled: !!id,
  })
}

export const useSuspenseFindWaterVendoById = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["water-vendo", id],
    queryFn: async () => await findWaterVendoById(id),
  })
}
