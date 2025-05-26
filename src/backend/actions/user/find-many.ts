import { queryOptions, useInfiniteQuery } from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"
import { useQuery } from "@tanstack/react-query"

import type { QueryClient } from "@tanstack/react-query"
import type { User } from "@/schemas/drizzle-schema"

export type UserFilters = {
  page?: number
  limit?: number
  search?: string
  role?: "admin" | "user"
  excludeCurrentUser?: boolean
}

export type PaginatedUsersResponse = {
  data: User[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function findManyUser(
  filters: UserFilters = {},
): Promise<PaginatedUsersResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    excludeCurrentUser = true,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (role) params.append("role", role)
  if (excludeCurrentUser) params.append("excludeCurrentUser", "true")

  const queryString = params.toString()
  return await api.get<PaginatedUsersResponse>(`auth/find-many?${queryString}`)
}

export async function preFindManyUser(filters: UserFilters = {}) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      excludeCurrentUser = true,
    } = filters

    return queryOptions({
      queryKey: ["users", { page, limit, search, role, excludeCurrentUser }],
      queryFn: async () => await findManyUser(filters),
    })
  }
}

export const useFindManyUser = (filters: UserFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    excludeCurrentUser = true,
  } = filters

  return useQuery<PaginatedUsersResponse>({
    queryKey: ["users", { page, limit, search, role, excludeCurrentUser }],
    queryFn: async () => await findManyUser(filters),
  })
}

export const useInfiniteUsers = (filters: Omit<UserFilters, "page"> = {}) => {
  const { limit = 10, search, role, excludeCurrentUser = true } = filters

  return useInfiniteQuery({
    queryKey: ["users-infinite", { limit, search, role, excludeCurrentUser }],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyUser({
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
