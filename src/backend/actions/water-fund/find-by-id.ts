import { WaterFunds } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { useQuery } from "@tanstack/react-query"

export type WaterFundWithVendoLocation = WaterFunds & {
  vendoLocation: string
}

export async function findWaterFundById(
  id: string,
): Promise<WaterFundWithVendoLocation> {
  return api.get<WaterFundWithVendoLocation>("water-funds/find-by-id?", {
    params: { id: id },
  })
}

export const useFindWaterFundById = (id: string) => {
  return useQuery({
    queryKey: ["water-fund", id],
    queryFn: async () => await findWaterFundById(id),
    enabled: !!id,
  })
}
