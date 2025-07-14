import { Igp, IgpSupply, IgpTransaction } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export type IgpWithRelations = Igp & {
  projectLeadData?: {
    id: string
    name: string
    email: string
    role: string
    image: string | null
    emailVerified: boolean
    sessionExpired: boolean
    createdAt: number
    updatedAt: number
  }
  transactions?: IgpTransaction[]
  supplies?: IgpSupply[]
  revenueData?: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    totalItemsSold: number
    averageRevenuePerItem: number
  }
}

export async function findIgpById(id: string): Promise<IgpWithRelations> {
  return api.get<IgpWithRelations>("igps/find-by-id", {
    params: { id },
  })
}

export async function preFindIgpById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["igp", id],
      queryFn: async () => await findIgpById(id),
    })
  }
}

export const useFindIgpById = (id: string) => {
  return useQuery({
    queryKey: ["igp", id],
    queryFn: async () => await findIgpById(id),
    enabled: !!id,
  })
}
