import { WaterFunds } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export type WaterFundFilters = {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  vendoId?: string
  search?: string
}

export type PaginatedWaterFundsResponse = {
  data: (WaterFunds & { vendoLocation: string })[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyWaterFunds(
  filters: WaterFundFilters = {},
): Promise<PaginatedWaterFundsResponse> {
  const { page = 1, limit = 10, startDate, endDate, vendoId, search } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (vendoId) params.append("vendoId", vendoId)
  if (search) params.append("search", search)

  const queryString = params.toString()
  return await api.get<PaginatedWaterFundsResponse>(
    `water-funds/find-many?${queryString}`,
  )
}

export async function preFindManyWaterFunds(filters: WaterFundFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      vendoId,
      search,
    } = filters

    return queryOptions({
      queryKey: [
        "water-funds",
        {
          page,
          limit,
          startDate,
          endDate,
          vendoId,
          search,
        },
      ],
      queryFn: async () => await findManyWaterFunds(filters),
    })
  }
}

export const useFindManyWaterFunds = (filters: WaterFundFilters = {}) => {
  const { page = 1, limit = 10, startDate, endDate, vendoId, search } = filters

  return useQuery<PaginatedWaterFundsResponse>({
    queryKey: [
      "water-funds",
      {
        page,
        limit,
        startDate,
        endDate,
        vendoId,
        search,
      },
    ],
    queryFn: async () => await findManyWaterFunds(filters),
  })
}

export const useInfiniteWaterFunds = (
  filters: Omit<WaterFundFilters, "page"> = {},
) => {
  const { limit = 10, startDate, endDate, vendoId, search } = filters

  return useInfiniteQuery({
    queryKey: [
      "water-funds-infinite",
      { limit, startDate, endDate, vendoId, search },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyWaterFunds({
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
