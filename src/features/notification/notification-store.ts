import { useFindManyNotifications } from "@/backend/actions/notification/find-many"
import { useSession } from "@/components/context/session"
import { useEffect } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotificationState {
  unreadCount: number
  setUnreadCount: (count: number) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      unreadCount: 0,
      setUnreadCount: (count: number) => set({ unreadCount: count }),
    }),
    {
      name: "notification-storage",
    },
  ),
)

export const useNotificationCount = () => {
  const session = useSession()
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount)

  const { data: notificationsData } = useFindManyNotifications({
    status: "unread",
    recipientId: session?.userId,
    limit: 1,
  })

  useEffect(() => {
    if (notificationsData?.meta?.totalItems !== undefined) {
      setUnreadCount(notificationsData.meta.totalItems)
    }
  }, [notificationsData?.meta?.totalItems, setUnreadCount])

  return notificationsData?.meta?.totalItems || 0
}
