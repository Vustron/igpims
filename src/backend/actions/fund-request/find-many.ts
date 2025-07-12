import { FundRequest, User } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export interface FundRequestFilters {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
  status?: string
  requestor?: string
}

export interface PaginatedFundRequestsResponse {
  data: (FundRequest & {
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
  })[]
  users: User[]
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

export async function findManyFundRequests(
  filters: FundRequestFilters = {},
): Promise<PaginatedFundRequestsResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    requestor,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (sort) params.append("sort", sort)
  if (status) params.append("status", status)
  if (requestor) params.append("requestor", requestor)

  const queryString = params.toString()
  return await api.get<PaginatedFundRequestsResponse>(
    `fund-requests/find-many?${queryString}`,
  )
}

export async function preFindManyFundRequests(
  filters: FundRequestFilters = {},
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
      requestor,
    } = filters

    return queryOptions({
      queryKey: [
        "fund-requests",
        { page, limit, search, startDate, endDate, sort, status, requestor },
      ],
      queryFn: async () => await findManyFundRequests(filters),
    })
  }
}

export const useFindManyFundRequests = (filters: FundRequestFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    requestor,
  } = filters

  return useQuery<PaginatedFundRequestsResponse>({
    queryKey: [
      "fund-requests",
      { page, limit, search, startDate, endDate, sort, status, requestor },
    ],
    queryFn: async () => await findManyFundRequests(filters),
  })
}

export const useInfiniteFindManyFundRequests = (
  filters: Omit<FundRequestFilters, "page"> = {},
) => {
  const {
    limit = 10,
    search,
    startDate,
    endDate,
    sort,
    status,
    requestor,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "fund-requests-infinite",
      { limit, search, startDate, endDate, sort, status, requestor },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyFundRequests({
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
