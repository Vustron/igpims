import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export interface FinancialDataResponse {
  reportPeriod: string
  dateGenerated: number
  igps: {
    name: string
    type: string
    startDate: number
    endDate: number
    assignedOfficers: string
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    totalTransactions: number
    averageTransaction: number
    profitMargin: number
    transactions: {
      date: number
      description: string
      amount: number
      type: string
    }[]
  }[]
}

export async function getFinancialData(): Promise<FinancialDataResponse> {
  return api.get<FinancialDataResponse>("analytics/get-financial-data")
}

export async function preFetchFinancialData() {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["financial-data"],
      queryFn: async () => await getFinancialData(),
    })
  }
}

export const useGetFinancialData = ({ isEnabled }: { isEnabled: boolean }) => {
  return useQuery({
    queryKey: ["financial-data"],
    queryFn: async () => {
      const response = await api.get<{ data: FinancialDataResponse }>(
        "analytics/get-financial-data",
      )
      return response.data
    },
    enabled: isEnabled,
  })
}
