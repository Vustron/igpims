import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Notification,
  NotificationStatus,
} from "@/features/notification/notification-types"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(
          (n) => n.status === "unread",
        ).length
        set({ notifications, unreadCount })
      },
      markAsRead: (id) => {
        const { notifications } = get()
        const updatedNotifications = notifications.map((notification) =>
          notification.id === id
            ? { ...notification, status: "read" as NotificationStatus }
            : notification,
        )
        const unreadCount = updatedNotifications.filter(
          (n) => n.status === "unread",
        ).length
        set({ notifications: updatedNotifications, unreadCount })
      },
      markAllAsRead: () => {
        const { notifications } = get()
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          status: "read" as NotificationStatus,
        }))
        set({ notifications: updatedNotifications, unreadCount: 0 })
      },
    }),
    {
      name: "notification-storage",
    },
  ),
)
