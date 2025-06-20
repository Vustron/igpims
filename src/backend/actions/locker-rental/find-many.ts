import { queryOptions, useInfiniteQuery } from "@tanstack/react-query"
import type { LockerRental } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"

import { useQuery } from "@tanstack/react-query"

import type { QueryClient } from "@tanstack/react-query"

export type RentalFilters = {
  page?: number
  limit?: number
  rentalStatus?: "active" | "pending" | "expired" | "cancelled"
  paymentStatus?: "paid" | "pending" | "partial" | "overdue"
  search?: string
  renterName?: string
  courseAndSet?: string
}

export type PaginatedRentalsResponse = {
  data: LockerRental[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyRentals(
  filters: RentalFilters = {},
): Promise<PaginatedRentalsResponse> {
  const {
    page = 1,
    limit = 10,
    rentalStatus,
    paymentStatus,
    search,
    renterName,
    courseAndSet,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (rentalStatus) params.append("rentalStatus", rentalStatus)
  if (paymentStatus) params.append("paymentStatus", paymentStatus)
  if (search) params.append("search", search)
  if (renterName) params.append("renterName", renterName)
  if (courseAndSet) params.append("courseAndSet", courseAndSet)

  const queryString = params.toString()
  return await api.get<PaginatedRentalsResponse>(
    `locker-rentals/find-many?${queryString}`,
  )
}

export async function preFindManyRentals(filters: RentalFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      rentalStatus,
      paymentStatus,
      search,
      renterName,
      courseAndSet,
    } = filters

    return queryOptions({
      queryKey: [
        "locker-rentals",
        {
          page,
          limit,
          rentalStatus,
          paymentStatus,
          search,
          renterName,
          courseAndSet,
        },
      ],
      queryFn: async () => await findManyRentals(filters),
    })
  }
}

export const useFindManyRentals = (filters: RentalFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    rentalStatus,
    paymentStatus,
    search,
    renterName,
    courseAndSet,
  } = filters

  return useQuery<PaginatedRentalsResponse>({
    queryKey: [
      "locker-rentals",
      {
        page,
        limit,
        rentalStatus,
        paymentStatus,
        search,
        renterName,
        courseAndSet,
      },
    ],
    queryFn: async () => await findManyRentals(filters),
  })
}

export const useInfiniteRentals = (
  filters: Omit<RentalFilters, "page"> = {},
) => {
  const {
    limit = 10,
    rentalStatus,
    paymentStatus,
    search,
    renterName,
    courseAndSet,
  } = filters

  return useInfiniteQuery({
    queryKey: [
      "locker-rentals-infinite",
      { limit, rentalStatus, paymentStatus, search, renterName, courseAndSet },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyRentals({
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
