import { useFindManyNotifications } from "@/backend/actions/notification/find-many"
import { useSession } from "@/components/context/session"
import { useEffect, useMemo } from "react"
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

  const { data: notificationsData } = useFindManyNotifications()

  const unreadCount = useMemo(() => {
    if (!notificationsData?.data || !session?.userId) return 0

    const userId = session.userId
    return notificationsData.data.filter(
      (notification) => !notification.status.includes(userId),
    ).length
  }, [notificationsData?.data, session?.userId])

  useEffect(() => {
    setUnreadCount(unreadCount)
  }, [unreadCount, setUnreadCount])

  return unreadCount
}
