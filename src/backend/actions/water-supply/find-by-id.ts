import { useQuery } from "@tanstack/react-query"
import { WaterSupply } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"

export type WaterSupplyWithVendoLocation = WaterSupply & {
  vendoLocation: string
}

export async function findWaterSupplyById(
  id: string,
): Promise<WaterSupplyWithVendoLocation> {
  return api.get<WaterSupplyWithVendoLocation>(
    `water-supplies/find-by-id?id=${id}`,
  )
}

export const useFindWaterSupplyById = (id: string) => {
  return useQuery({
    queryKey: ["water-supply", id],
    queryFn: async () => await findWaterSupplyById(id),
    enabled: !!id,
  })
}
