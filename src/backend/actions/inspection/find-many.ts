import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"
import { Inspection } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"

export interface InspectionFilters {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
}

export interface PaginatedInspectionsResponse {
  data: Inspection[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyInspections(
  filters: InspectionFilters = {},
): Promise<PaginatedInspectionsResponse> {
  const { page = 1, limit = 10, search, startDate, endDate, sort } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (sort) params.append("sort", sort)

  const queryString = params.toString()
  return await api.get<PaginatedInspectionsResponse>(
    `inspections/find-many?${queryString}`,
  )
}

export async function preFindManyInspections(filters: InspectionFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const { page = 1, limit = 10, search, startDate, endDate, sort } = filters

    return queryOptions({
      queryKey: [
        "inspections",
        { page, limit, search, startDate, endDate, sort },
      ],
      queryFn: async () => await findManyInspections(filters),
    })
  }
}

export const useFindManyInspections = (filters: InspectionFilters = {}) => {
  const { page = 1, limit = 10, search, startDate, endDate, sort } = filters

  return useQuery<PaginatedInspectionsResponse>({
    queryKey: [
      "inspections",
      { page, limit, search, startDate, endDate, sort },
    ],
    queryFn: async () => await findManyInspections(filters),
  })
}

export const useInfiniteFindManyInspections = (
  filters: Omit<InspectionFilters, "page"> = {},
) => {
  const { limit = 10, search, startDate, endDate, sort } = filters

  return useInfiniteQuery({
    queryKey: [
      "inspections-infinite",
      { limit, search, startDate, endDate, sort },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyInspections({
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
