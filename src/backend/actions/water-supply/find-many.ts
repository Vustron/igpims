import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"
import { WaterSupply } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"

export type WaterSupplyFilters = {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  vendoId?: string
  search?: string
}

export type PaginatedWaterSuppliesResponse = {
  data: (WaterSupply & { vendoLocation: string })[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyWaterSupplies(
  filters: WaterSupplyFilters = {},
): Promise<PaginatedWaterSuppliesResponse> {
  const { page = 1, limit = 10, startDate, endDate, vendoId, search } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (vendoId) params.append("vendoId", vendoId)
  if (search) params.append("search", search)

  const queryString = params.toString()
  return await api.get<PaginatedWaterSuppliesResponse>(
    `water-supplies/find-many?${queryString}`,
  )
}

export async function preFindManyWaterSupplies(
  filters: WaterSupplyFilters = {},
) {
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
        "water-supplies",
        {
          page,
          limit,
          startDate,
          endDate,
          vendoId,
          search,
        },
      ],
      queryFn: async () => await findManyWaterSupplies(filters),
    })
  }
}

export const useFindManyWaterSupplies = (filters: WaterSupplyFilters = {}) => {
  const { page = 1, limit = 10, startDate, endDate, vendoId, search } = filters

  return useQuery<PaginatedWaterSuppliesResponse>({
    queryKey: [
      "water-supplies",
      {
        page,
        limit,
        startDate,
        endDate,
        vendoId,
        search,
      },
    ],
    queryFn: async () => await findManyWaterSupplies(filters),
  })
}

export const useInfiniteWaterSupplies = (
  filters: Omit<WaterSupplyFilters, "page"> = {},
) => {
  const { limit = 10, startDate, endDate, vendoId, search } = filters

  return useInfiniteQuery({
    queryKey: [
      "water-supplies-infinite",
      { limit, startDate, endDate, vendoId, search },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyWaterSupplies({
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
