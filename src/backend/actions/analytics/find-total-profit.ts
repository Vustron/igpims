import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export interface MonthlyRevenueData {
  month: string
  igpRevenue: number
  lockerRentals: number
  waterVendo: number
}

export interface IgpRevenue {
  id: string
  name: string
  revenue: number
  totalSold: number
  costPerItem: number
  status: string
  createdAt: number
}

export interface ProfitData {
  data: {
    totalIgpRevenue: number
    totalIgpSold: number
    totalLockerRevenue: number
    totalWaterRevenue: number
    totalWaterExpenses: number
    totalWaterProfit: number
    totalExpenseTransactions: number
    totalFundsUtilized: number
    totalFundRequests: number
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    activeLockersCount: number
    activeMachinesCount: number
    igpPercentageChange: string
    lockerPercentageChange: string
    waterPercentageChange: string
    activeLockersPercentageChange: string
    activeMachinesPercentageChange: string
  }
  igpRevenues: IgpRevenue[]
  monthlyRevenue: MonthlyRevenueData[]
}

export type TotalProfitResponse = ProfitData

export async function findTotalProfit(): Promise<TotalProfitResponse> {
  return api.get<TotalProfitResponse>("analytics/find-total-profit")
}

export async function preFindTotalProfit() {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["total-profit"],
      queryFn: async () => await findTotalProfit(),
    })
  }
}

export const useFindTotalProfit = () => {
  return useQuery({
    queryKey: ["total-profit"],
    queryFn: async () => await findTotalProfit(),
  })
}
