import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  UpdateNotificationPayload,
  updateNotificationSchema,
} from "@/validation/notification"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import {
  NotificationWithActorData,
  PaginatedNotificationResponse,
} from "./find-many"

export async function updateNotification(
  id: string,
  payload: UpdateNotificationPayload,
): Promise<NotificationWithActorData> {
  return api.patch<UpdateNotificationPayload, NotificationWithActorData>(
    "notifications/update-notification",
    payload,
    {
      params: { id },
    },
  )
}

export const useUpdateNotification = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-notification"],
    mutationFn: async ({
      id,
      payload,
    }: { id: string; payload: UpdateNotificationPayload }) => {
      const statusArray = Array.isArray(payload.status)
        ? payload.status
        : typeof payload.status === "string"
          ? payload.status
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : []
      const sanitizedData = sanitizer<UpdateNotificationPayload>(
        {
          ...payload,
          status: statusArray,
        },
        updateNotificationSchema,
      )
      return await updateNotification(id, sanitizedData)
    },
    onMutate: async ({ id, payload: updatedData }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["notification", id] }),
        queryClient.cancelQueries({ queryKey: ["notifications"] }),
        queryClient.cancelQueries({ queryKey: ["notifications-infinite"] }),
      ])

      const previousNotification =
        queryClient.getQueryData<NotificationWithActorData>([
          "notification",
          id,
        ])
      const previousNotifications = queryClient.getQueryData(["notifications"])
      const previousNotificationsInfinite = queryClient.getQueryData([
        "notifications-infinite",
      ])

      if (previousNotification) {
        const optimisticNotification = {
          ...previousNotification,
          ...updatedData,
          updatedAt: Date.now(),
        }

        queryClient.setQueryData(["notification", id], optimisticNotification)

        queryClient.setQueriesData<PaginatedNotificationResponse>(
          { queryKey: ["notifications"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData
            return {
              ...oldData,
              data: oldData.data.map((notification: any) =>
                notification.id === id ? optimisticNotification : notification,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: ["notifications-infinite"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map(
                (page: PaginatedNotificationResponse) => ({
                  ...page,
                  data: page.data.map((notification) =>
                    notification.id === id
                      ? optimisticNotification
                      : notification,
                  ),
                }),
              ),
            }
          },
        )
      }

      return {
        previousNotification,
        previousNotifications,
        previousNotificationsInfinite,
      }
    },
    onSuccess: (updatedNotification: NotificationWithActorData, { id }) => {
      queryClient.setQueryData(["notification", id], updatedNotification)

      queryClient.setQueriesData<PaginatedNotificationResponse>(
        { queryKey: ["notifications"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((notification: any) =>
              notification.id === id ? updatedNotification : notification,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["notifications-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedNotificationResponse) => ({
              ...page,
              data: page.data.map((notification) =>
                notification.id === id ? updatedNotification : notification,
              ),
            })),
          }
        },
      )
    },
    onError: (error, { id }, context) => {
      if (context?.previousNotification) {
        queryClient.setQueryData(
          ["notification", id],
          context.previousNotification,
        )
      }
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        )
      }
      if (context?.previousNotificationsInfinite) {
        queryClient.setQueryData(
          ["notifications-infinite"],
          context.previousNotificationsInfinite,
        )
      }
      catchError(error)
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notification", id] })
      queryClient.invalidateQueries({ queryKey: ["notifications-infinite"] })
      router.refresh()
    },
  })
}
