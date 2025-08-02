import { api } from "@/backend/helpers/api-client"
import {
  QueryClient,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"

export interface NotificationFilters {
  page?: number
  limit?: number
  search?: string
  type?: string
  status?: string
  action?: string
  recipientId?: string
}

export interface PaginatedNotificationResponse {
  data: NotificationWithActorData[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface NotificationWithActorData {
  id: string
  type: "fund_request" | "project_request" | "igp"
  requestId: string
  title: string
  description: string
  status: "unread" | "read"
  action:
    | "created"
    | "updated"
    | "submitted"
    | "reviewed"
    | "approved"
    | "rejected"
    | "checked"
    | "disbursed"
    | "received"
    | "receipted"
    | "validated"
    | "resolution_created"
  actor: string | null
  recipientId: string
  details: string
  createdAt: number
  updatedAt: number
  actorData?: {
    id: string
    name: string
    email: string
    role: string
    image: string | null
  }
}

export async function findManyNotifications(
  filters: NotificationFilters = {},
): Promise<PaginatedNotificationResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    type,
    status,
    action,
    recipientId,
  } = filters

  const params = new URLSearchParams()
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  if (search) params.append("search", search)
  if (type) params.append("type", type)
  if (status) params.append("status", status)
  if (action) params.append("action", action)
  if (recipientId) params.append("recipientId", recipientId)

  const queryString = params.toString()
  return await api.get<PaginatedNotificationResponse>(
    `notifications/find-many-notifications?${queryString}`,
  )
}

export async function preFindManyNotifications(
  filters: NotificationFilters = {},
) {
  return async (_queryClient: QueryClient) => {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      action,
      recipientId,
    } = filters

    return queryOptions({
      queryKey: [
        "notifications",
        {
          page,
          limit,
          search,
          type,
          status,
          action,
          recipientId,
        },
      ],
      queryFn: async () => await findManyNotifications(filters),
    })
  }
}

export const useFindManyNotifications = (filters: NotificationFilters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    type,
    status,
    action,
    recipientId,
  } = filters

  return useQuery<PaginatedNotificationResponse>({
    queryKey: [
      "notifications",
      {
        page,
        limit,
        search,
        type,
        status,
        action,
        recipientId,
      },
    ],
    queryFn: async () => await findManyNotifications(filters),
  })
}

export const useInfiniteFindManyNotifications = (
  filters: Omit<NotificationFilters, "page"> = {},
) => {
  const { limit = 10, search, type, status, action, recipientId } = filters

  return useInfiniteQuery({
    queryKey: [
      "notifications-infinite",
      {
        limit,
        search,
        type,
        status,
        action,
        recipientId,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await findManyNotifications({
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
