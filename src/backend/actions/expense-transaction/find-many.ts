import { ExpenseTransaction } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export interface ExpenseTransactionFilters {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
  status?: string
  requestId?: string
  id?: string
  expenseName?: string
}

export interface PaginatedExpenseTransactionsResponse {
  data: ExpenseTransactionWithRequestor[]
  profitData: {
    totalLockerRevenue: number
    totalWaterRevenue: number
    totalWaterExpenses: number
    totalWaterProfit: number
    totalExpenseTransactions: number
    totalRevenue: number
    totalExpenses: number
    netProfit: number
  }
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export type ExpenseTransactionWithRequestor = ExpenseTransaction & {
  requestData: {
    id: string
    purpose: string
    amount: number
    status: string
    requestor: string
    requestorPosition: string
  }
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

export async function findManyExpenseTransactions(
  filters: ExpenseTransactionFilters = {},
): Promise<PaginatedExpenseTransactionsResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    requestId,
    id,
    expenseName,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (sort) params.append("sort", sort)
  if (status) params.append("status", status)
  if (requestId) params.append("requestId", requestId)
  if (id) params.append("id", id)
  if (expenseName) params.append("expenseName", expenseName)

  const queryString = params.toString()
  return await api.get<PaginatedExpenseTransactionsResponse>(
    `expense-transactions/find-many?${queryString}`,
  )
}

export async function preFindManyExpenseTransactions(
  filters: ExpenseTransactionFilters = {},
) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      sort,
      status,
      requestId,
      id,
      expenseName,
    } = filters

    return queryOptions({
      queryKey: [
        "expense-transactions",
        {
          page,
          limit,
          search,
          startDate,
          endDate,
          sort,
          status,
          requestId,
          id,
          expenseName,
        },
      ],
      queryFn: async () => await findManyExpenseTransactions(filters),
    })
  }
}

export const useFindManyExpenseTransactions = (
  filters: ExpenseTransactionFilters = {},
) => {
  const {
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    requestId,
    id,
    expenseName,
  } = filters

  return useQuery<PaginatedExpenseTransactionsResponse>({
    queryKey: [
      "expense-transactions",
      {
        page,
        limit,
        search,
        startDate,
        endDate,
        sort,
        status,
        requestId,
        id,
        expenseName,
      },
    ],
    queryFn: async () => await findManyExpenseTransactions(filters),
  })
}

export const useInfiniteFindManyExpenseTransactions = (
  filters: Omit<ExpenseTransactionFilters, "page"> = {},
) => {
  const {
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    requestId,
    id,
    expenseName,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "expense-transactions-infinite",
      {
        limit,
        search,
        startDate,
        endDate,
        sort,
        status,
        requestId,
        id,
        expenseName,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyExpenseTransactions({
        ...filters,
        page: pageParam,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.meta.hasPrevPage ? firstPage.meta.page - 1 : undefined,
  })
}
