import { IgpSupply } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export interface IgpSupplyFilters {
  page?: number
  limit?: number
  search?: string
  igpId?: string
  startDate?: string
  endDate?: string
  sort?: string
}

export interface PaginatedIgpSupplyResponse {
  data: (IgpSupply & {
    igpData?: {
      id: string
      igpName: string
      igpType: string
    }
  })[]
  summary: {
    totalQuantity: number
    totalSold: number
    totalExpenses: number
    totalRevenue: number
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

export type IgpSupplyWithIgp = IgpSupply & {
  igp?: {
    id: string
    igpName: string
    igpType: string
  }
}

export async function findManyIgpSupply(
  filters: IgpSupplyFilters = {},
): Promise<PaginatedIgpSupplyResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    igpId,
    startDate,
    endDate,
    sort,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (igpId) params.append("igpId", igpId)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (sort) params.append("sort", sort)

  const queryString = params.toString()
  return await api.get<PaginatedIgpSupplyResponse>(
    `igp-supplies/find-many?${queryString}`,
  )
}

export async function preFindManyIgpSupply(filters: IgpSupplyFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      igpId,
      startDate,
      endDate,
      sort,
    } = filters

    return queryOptions({
      queryKey: [
        "igp-supplies",
        {
          page,
          limit,
          search,
          igpId,
          startDate,
          endDate,
          sort,
        },
      ],
      queryFn: async () => await findManyIgpSupply(filters),
    })
  }
}

export const useFindManyIgpSupply = (filters: IgpSupplyFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    igpId,
    startDate,
    endDate,
    sort,
  } = filters

  return useQuery<PaginatedIgpSupplyResponse>({
    queryKey: [
      "igp-supplies",
      {
        page,
        limit,
        search,
        igpId,
        startDate,
        endDate,
        sort,
      },
    ],
    queryFn: async () => await findManyIgpSupply(filters),
  })
}

export const useInfiniteFindManyIgpSupply = (
  filters: Omit<IgpSupplyFilters, "page"> = {},
) => {
  const { limit = 10, search, igpId, startDate, endDate, sort } = filters

  return useInfiniteQuery({
    queryKey: [
      "igp-supplies-infinite",
      {
        limit,
        search,
        igpId,
        startDate,
        endDate,
        sort,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyIgpSupply({
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
