"use client"

import { NotificationFilters } from "@/features/notification/notification-filters"
import { NotificationHeader } from "@/features/notification/notification-header"
import { NotificationTabs } from "@/features/notification/notifications-tab"

import { useNotificationStore } from "@/features/notification/notification-store"
import { useState, useEffect } from "react"

import { generateMockNotifications } from "@/features/notification/mock-data-notification"
import { format } from "date-fns/format"

import type {
  Notification,
  NotificationType,
  NotificationAction,
} from "@/features/notification/notification-types"

export const NotificationClient = () => {
  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore()

  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<NotificationType | "all">("all")
  const [filterAction, setFilterAction] = useState<NotificationAction | "all">(
    "all",
  )

  useEffect(() => {
    // Generate mock data on component mount if there are no notifications
    if (notifications.length === 0) {
      const mockData = generateMockNotifications()
      setNotifications(mockData)
    }
  }, [notifications.length, setNotifications])

  // Refresh notifications with new mock data
  const refreshNotifications = () => {
    const mockData = generateMockNotifications()
    setNotifications(mockData)
  }

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    // Text search filter
    if (
      searchTerm &&
      !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !notification.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !notification.requestId.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Type filter
    if (filterType !== "all" && notification.type !== filterType) {
      return false
    }

    // Action filter
    if (filterAction !== "all" && notification.action !== filterAction) {
      return false
    }

    // Tab filter
    if (activeTab === "unread" && notification.status !== "unread") {
      return false
    }

    return true
  })

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.timestamp)
      const formattedDate = format(date, "MMMM d, yyyy")

      if (!groups[formattedDate]) {
        groups[formattedDate] = []
      }

      groups[formattedDate].push(notification)
      return groups
    },
    {} as Record<string, Notification[]>,
  )

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
        filteredCount={filteredNotifications.length}
        onClearFilters={() => {
          setSearchTerm("")
          setFilterType("all")
          setFilterAction("all")
        }}
      />
    </div>
  )
}
