import { IgpTransaction } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export interface IgpTransactionFilters {
  page?: number
  limit?: number
  search?: string
  igpId?: string
  startDate?: string
  endDate?: string
  sort?: string
  itemReceived?: "pending" | "received" | "cancelled"
  purchaserName?: string
  courseAndSet?: string
  batch?: string
}

export interface PaginatedIgpTransactionResponse {
  data: (IgpTransaction & {
    igpData?: {
      id: string
      igpName: string
      igpType: string
      costPerItem: number
    }
    totalAmount: number
  })[]
  summary: {
    totalTransactions: number
    totalAmount: number
    totalQuantity: number
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

export type IgpTransactionWithIgp = IgpTransaction & {
  igp?: {
    id: string
    igpName: string
    costPerItem: number
    projectLead?: {
      id: string
      name: string
      email: string
    }
  }
  totalAmount: number
}

export async function findManyIgpTransaction(
  filters: IgpTransactionFilters = {},
): Promise<PaginatedIgpTransactionResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    igpId,
    startDate,
    endDate,
    sort,
    itemReceived,
    purchaserName,
    courseAndSet,
    batch,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (igpId) params.append("igpId", igpId)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (sort) params.append("sort", sort)
  if (itemReceived) params.append("itemReceived", itemReceived)
  if (purchaserName) params.append("purchaserName", purchaserName)
  if (courseAndSet) params.append("courseAndSet", courseAndSet)
  if (batch) params.append("batch", batch)

  const queryString = params.toString()
  return await api.get<PaginatedIgpTransactionResponse>(
    `igp-transactions/find-many?${queryString}`,
  )
}

export async function preFindManyIgpTransaction(
  filters: IgpTransactionFilters = {},
) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      igpId,
      startDate,
      endDate,
      sort,
      itemReceived,
      purchaserName,
      courseAndSet,
      batch,
    } = filters

    return queryOptions({
      queryKey: [
        "igp-transactions",
        {
          page,
          limit,
          search,
          igpId,
          startDate,
          endDate,
          sort,
          itemReceived,
          purchaserName,
          courseAndSet,
          batch,
        },
      ],
      queryFn: async () => await findManyIgpTransaction(filters),
    })
  }
}

export const useFindManyIgpTransaction = (
  filters: IgpTransactionFilters = {},
) => {
  const {
    page = 1,
    limit = 10,
    search,
    igpId,
    startDate,
    endDate,
    sort,
    itemReceived,
    purchaserName,
    courseAndSet,
    batch,
  } = filters

  return useQuery<PaginatedIgpTransactionResponse>({
    queryKey: [
      "igp-transactions",
      {
        page,
        limit,
        search,
        igpId,
        startDate,
        endDate,
        sort,
        itemReceived,
        purchaserName,
        courseAndSet,
        batch,
      },
    ],
    queryFn: async () => await findManyIgpTransaction(filters),
  })
}

export const useInfiniteFindManyIgpTransaction = (
  filters: Omit<IgpTransactionFilters, "page"> = {},
) => {
  const {
    limit = 10,
    search,
    igpId,
    startDate,
    endDate,
    sort,
    itemReceived,
    purchaserName,
    courseAndSet,
    batch,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "igp-transactions-infinite",
      {
        limit,
        search,
        igpId,
        startDate,
        endDate,
        sort,
        itemReceived,
        purchaserName,
        courseAndSet,
        batch,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyIgpTransaction({
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
