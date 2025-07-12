import { ExpenseTransaction, FundRequest, User } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export type FundRequestWithUser = FundRequest & {
  requestorData?: {
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
  users?: User[]
  expenses?: ExpenseTransaction[]
  profitData?: {
    totalLockerRevenue: number
    totalWaterRevenue: number
    totalWaterExpenses: number
    totalWaterProfit: number
    totalExpenseTransactions: number
    totalRevenue: number
    totalExpenses: number
    netProfit: number
  }
}

export async function findFundRequestById(
  id: string,
): Promise<FundRequestWithUser> {
  return api.get<FundRequestWithUser>("fund-requests/find-by-id", {
    params: { id },
  })
}

export async function preFindFundRequestById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["fund-request", id],
      queryFn: async () => await findFundRequestById(id),
    })
  }
}

export const useFindFundRequestById = (id: string) => {
  return useQuery({
    queryKey: ["fund-request", id],
    queryFn: async () => await findFundRequestById(id),
    enabled: !!id,
  })
}
