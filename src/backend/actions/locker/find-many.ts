import { Locker } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export type LockerFilters = {
  page?: number
  limit?: number
  status?:
    | "available"
    | "occupied"
    | "reserved"
    | "maintenance"
    | "out-of-service"
  type?: string
  location?: string
  search?: string
  cluster?: string
}

export type PaginatedLockersResponse = {
  data: Locker[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyLockers(
  filters: LockerFilters = {},
): Promise<PaginatedLockersResponse> {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    location,
    search,
    cluster,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (status) params.append("status", status)
  if (type) params.append("type", type)
  if (location) params.append("location", location)
  if (search) params.append("search", search)
  if (cluster) params.append("cluster", cluster)

  const queryString = params.toString()
  return await api.get<PaginatedLockersResponse>(
    `lockers/find-many?${queryString}`,
  )
}

export async function preFindManyLockers(filters: LockerFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      location,
      search,
      cluster,
    } = filters

    return queryOptions({
      queryKey: [
        "lockers",
        { page, limit, status, type, location, search, cluster },
      ],
      queryFn: async () => await findManyLockers(filters),
    })
  }
}

export const useFindManyLockers = (filters: LockerFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    location,
    search,
    cluster,
  } = filters

  return useQuery<PaginatedLockersResponse>({
    queryKey: [
      "lockers",
      { page, limit, status, type, location, search, cluster },
    ],
    queryFn: async () => await findManyLockers(filters),
  })
}

export const useInfiniteLockers = (
  filters: Omit<LockerFilters, "page"> = {},
) => {
  const { limit = 10, status, type, location, search, cluster } = filters

  return useInfiniteQuery({
    queryKey: [
      "lockers-infinite",
      { limit, status, type, location, search, cluster },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyLockers({
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
