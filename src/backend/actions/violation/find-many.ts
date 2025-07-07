import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"
import { Violation } from "@/validation/violation"

export interface ViolationFilters {
  page?: number
  limit?: number
  search?: string
  violationType?: string
  fineStatus?: string
  fromDate?: number
  toDate?: number
}

export type ViolationWithRenters = Violation & {
  renters: Renter[]
}

export interface Renter {
  renterId: string
  renterName: string
  courseAndSet: string
}
export interface PaginatedViolationsResponse {
  data: ViolationWithRenters[]
  meta: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyViolations(
  filters: ViolationFilters = {},
): Promise<PaginatedViolationsResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    violationType,
    fineStatus,
    fromDate,
    toDate,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (violationType) params.append("violationType", violationType)
  if (fineStatus) params.append("fineStatus", fineStatus)
  if (fromDate) params.append("fromDate", fromDate.toString())
  if (toDate) params.append("toDate", toDate.toString())

  const queryString = params.toString()
  return await api.get<PaginatedViolationsResponse>(
    `violations/find-many?${queryString}`,
  )
}

export async function preFindManyViolations(filters: ViolationFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      violationType,
      fineStatus,
      fromDate,
      toDate,
    } = filters

    return queryOptions({
      queryKey: [
        "violations",
        {
          page,
          limit,
          search,
          violationType,
          fineStatus,
          fromDate,
          toDate,
        },
      ],
      queryFn: async () => await findManyViolations(filters),
    })
  }
}

export const useFindManyViolations = (filters: ViolationFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    violationType,
    fineStatus,
    fromDate,
    toDate,
  } = filters

  return useQuery<PaginatedViolationsResponse>({
    queryKey: [
      "violations",
      {
        page,
        limit,
        search,
        violationType,
        fineStatus,
        fromDate,
        toDate,
      },
    ],
    queryFn: async () => await findManyViolations(filters),
  })
}

export const useInfiniteViolations = (
  filters: Omit<ViolationFilters, "page"> = {},
) => {
  const {
    limit = 10,
    search,
    violationType,
    fineStatus,
    fromDate,
    toDate,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "violations-infinite",
      { limit, search, violationType, fineStatus, fromDate, toDate },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyViolations({
        ...filters,
        page: pageParam,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.currentPage + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.meta.hasPrevPage ? firstPage.meta.currentPage - 1 : undefined,
  })
}
