"use client"

import { useFindManyNotifications } from "@/backend/actions/notification/find-many"
import { NotificationAction, NotificationType } from "@/backend/db/schemas"
import { useSession } from "@/components/context/session"
import { Button } from "@/components/ui/buttons"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { NotificationFilters } from "./notification-filters"
import { NotificationHeader } from "./notification-header"
import { useNotificationStore } from "./notification-store"
import { NotificationTabs } from "./notifications-tab"

export const NotificationClient = () => {
  const session = useSession()
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<NotificationType | "all">("all")
  const [filterAction, setFilterAction] = useState<NotificationAction | "all">(
    "all",
  )
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useFindManyNotifications({
    page,
    limit,
    search: searchTerm || undefined,
    type: filterType !== "all" ? filterType : undefined,
    action: filterAction !== "all" ? filterAction : undefined,
    status: activeTab !== "all" ? (activeTab as "unread" | "read") : undefined,
    recipientId: session?.userId,
  })

  const notifications = notificationsData?.data || []
  const meta = notificationsData?.meta
  const unreadCount = notifications.filter((n) => n.status === "unread").length

  useEffect(() => {
    if (activeTab === "all") {
      setUnreadCount(unreadCount)
    }
  }, [unreadCount, activeTab, setUnreadCount])

  const markAsRead = async (_notificationId: string) => {
    try {
      // await updateNotificationMutation.mutateAsync({ status: "read" })
      refetch()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    // Implement mark all as read functionality
    try {
      // await Promise.all(unread notifications update mutations)
      refetch()
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const refreshNotifications = () => {
    refetch()
  }

  const handlePreviousPage = () => {
    if (meta?.hasPrevPage) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (meta?.hasNextPage) {
      setPage(page + 1)
    }
  }

  const groupedNotifications = notifications.reduce(
    (groups, notification) => {
      const formattedDate = formatDateFromTimestamp(notification.createdAt)

      if (!groups[formattedDate]) {
        groups[formattedDate] = []
      }

      groups[formattedDate].push(notification)
      return groups
    },
    {} as Record<string, typeof notifications>,
  )

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 py-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading notifications...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 py-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">Failed to load notifications</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-4">
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
        onRefresh={refreshNotifications}
      />

      <NotificationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterAction={filterAction}
        setFilterAction={setFilterAction}
      />

      <NotificationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        groupedNotifications={groupedNotifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        filteredCount={notifications.length}
        onClearFilters={() => {
          setSearchTerm("")
          setFilterType("all")
          setFilterAction("all")
          setPage(1)
        }}
      />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.totalItems)} of{" "}
            {meta.totalItems} notifications
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!meta.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm">
              Page {meta.page} of {meta.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!meta.hasNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
