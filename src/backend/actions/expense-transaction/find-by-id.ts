import { ExpenseTransaction, FundRequest } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export type ExpenseTransactionWithDetails = ExpenseTransaction & {
  fundRequest?: FundRequest & {
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
  }
  processedBy?: {
    id: string
    name: string
    email: string
  }
  approvedBy?: {
    id: string
    name: string
    email: string
  }
}

export async function findExpenseTransactionById(
  id: string,
): Promise<ExpenseTransactionWithDetails> {
  return api.get<ExpenseTransactionWithDetails>(
    "expense-transactions/find-by-id",
    {
      params: { id },
    },
  )
}

export async function preFindExpenseTransactionById(id: string) {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["expense-transaction", id],
      queryFn: async () => await findExpenseTransactionById(id),
    })
  }
}

export const useFindExpenseTransactionById = (id: string) => {
  return useQuery({
    queryKey: ["expense-transaction", id],
    queryFn: async () => await findExpenseTransactionById(id),
    enabled: !!id,
  })
}
