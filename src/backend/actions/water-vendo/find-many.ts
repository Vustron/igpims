import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"
import { WaterVendo } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"

export type WaterVendoFilters = {
  page?: number
  limit?: number
  vendoStatus?: "operational" | "maintenance" | "out-of-service" | "offline"
  waterRefillStatus?: "full" | "medium" | "low" | "empty"
  search?: string
  location?: string
}

export type PaginatedWaterVendosResponse = {
  data: WaterVendo[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyWaterVendos(
  filters: WaterVendoFilters = {},
): Promise<PaginatedWaterVendosResponse> {
  const {
    page = 1,
    limit = 10,
    vendoStatus,
    waterRefillStatus,
    search,
    location,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (vendoStatus) params.append("vendoStatus", vendoStatus)
  if (waterRefillStatus) params.append("waterRefillStatus", waterRefillStatus)
  if (search) params.append("search", search)
  if (location) params.append("location", location)

  const queryString = params.toString()
  return await api.get<PaginatedWaterVendosResponse>(
    `water-vendos/find-many?${queryString}`,
  )
}

export async function preFindManyWaterVendos(filters: WaterVendoFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      vendoStatus,
      waterRefillStatus,
      search,
      location,
    } = filters

    return queryOptions({
      queryKey: [
        "water-vendos",
        {
          page,
          limit,
          vendoStatus,
          waterRefillStatus: waterRefillStatus,
          search,
          location,
        },
      ],
      queryFn: async () => await findManyWaterVendos(filters),
    })
  }
}

export const useFindManyWaterVendos = (filters: WaterVendoFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    vendoStatus,
    waterRefillStatus,
    search,
    location,
  } = filters

  return useQuery<PaginatedWaterVendosResponse>({
    queryKey: [
      "water-vendos",
      {
        page,
        limit,
        vendoStatus,
        waterRefillStatus,
        search,
        location,
      },
    ],
    queryFn: async () => await findManyWaterVendos(filters),
  })
}

export const useInfiniteWaterVendos = (
  filters: Omit<WaterVendoFilters, "page"> = {},
) => {
  const {
    limit = 10,
    vendoStatus,
    waterRefillStatus,
    search,
    location,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "water-vendos-infinite",
      { limit, vendoStatus, waterRefillStatus, search, location },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyWaterVendos({
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
