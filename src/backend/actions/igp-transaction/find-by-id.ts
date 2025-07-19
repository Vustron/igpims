import { IgpTransaction } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export type IgpTransactionWithRelations = IgpTransaction & {
  igp?: {
    id: string
    igpName: string
    costPerItem: number
    projectLead?: {
      id: string
      name: string
      email: string
      role: string
      image: string | null
    }
  }
  totalAmount: number
}

export async function findIgpTransactionById(
  id: string,
): Promise<IgpTransactionWithRelations> {
  return api.get<IgpTransactionWithRelations>("igp-transactions/find-by-id", {
    params: { id },
  })
}

export async function preFindIgpTransactionById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["igp-transaction", id],
      queryFn: async () => await findIgpTransactionById(id),
    })
  }
}

export const useFindIgpTransactionById = (id: string) => {
  return useQuery({
    queryKey: ["igp-transaction", id],
    queryFn: async () => await findIgpTransactionById(id),
    enabled: !!id,
  })
}
