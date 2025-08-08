import { Activity } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export interface ActivityWithUser extends Omit<Activity, "createdAt"> {
  createdAt: number
  userData: {
    id: string
    name: string
    email: string
    role: string
    image: string | null
  } | null
}

export interface ActivityFilters {
  page?: number
  limit?: number
  search?: string
  userId?: string
  startDate?: string
  endDate?: string
  sort?: string
  action?: string
}

export interface PaginatedActivityResponse {
  data: ActivityWithUser[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyActivity(
  filters: ActivityFilters = {},
): Promise<PaginatedActivityResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    userId,
    startDate,
    endDate,
    sort,
    action,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (userId) params.append("userId", userId)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (sort) params.append("sort", sort)
  if (action) params.append("action", action)

  const queryString = params.toString()
  return await api.get<PaginatedActivityResponse>(
    `activities/find-many-activity?${queryString}`,
  )
}

export async function preFindManyActivity(filters: ActivityFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      userId,
      startDate,
      endDate,
      sort,
      action,
    } = filters

    return queryOptions({
      queryKey: [
        "activities",
        {
          page,
          limit,
          search,
          userId,
          startDate,
          endDate,
          sort,
          action,
        },
      ],
      queryFn: async () => await findManyActivity(filters),
    })
  }
}

export const useFindManyActivity = (filters: ActivityFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    userId,
    startDate,
    endDate,
    sort,
    action,
  } = filters

  return useQuery<PaginatedActivityResponse>({
    queryKey: [
      "activities",
      {
        page,
        limit,
        search,
        userId,
        startDate,
        endDate,
        sort,
        action,
      },
    ],
    queryFn: async () => await findManyActivity(filters),
  })
}

export const useInfiniteFindManyActivity = (
  filters: Omit<ActivityFilters, "page"> = {},
) => {
  const {
    limit = 10,
    search,
    userId,
    startDate,
    endDate,
    sort,
    action,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "activities-infinite",
      {
        limit,
        search,
        userId,
        startDate,
        endDate,
        sort,
        action,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyActivity({
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
