"use client"

import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badges"
import { Card } from "@/components/ui/cards"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/separators"
import { NotificationDateGroup } from "./notification-date-group"
import { NotificationEmptyState } from "./notification-empty-state"
import { Notification } from "./notification-types"

interface NotificationTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  groupedNotifications: Record<string, Notification[]>
  unreadCount: number
  onMarkAsRead: (id: string) => void
  filteredCount: number
  onClearFilters: () => void
}

export const NotificationTabs = ({
  activeTab,
  setActiveTab,
  groupedNotifications,
  unreadCount,
  onMarkAsRead,
  filteredCount,
  onClearFilters,
}: NotificationTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 sm:w-48">
        <TabsTrigger value="all" className="text-sm">
          All
        </TabsTrigger>
        <TabsTrigger
          value="unread"
          className="flex items-center gap-1.5 text-sm"
          aria-label={`Unread notifications (${unreadCount})`}
        >
          Unread
          {unreadCount > 0 && (
            <Badge variant="info" className="ml-1 h-5 min-w-5 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="p-0">
        {filteredCount > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(
              ([date, dateNotifications]) => (
                <NotificationDateGroup
                  key={date}
                  date={date}
                  notifications={dateNotifications}
                  onMarkAsRead={onMarkAsRead}
                />
              ),
            )}
          </div>
        ) : (
          <NotificationEmptyState
            hasFilters={activeTab !== "all"}
            onClearFilters={onClearFilters}
          />
        )}
      </TabsContent>

      <TabsContent value="unread" className="p-0">
        {filteredCount > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(
              ([date, dateNotifications]) => (
                <NotificationDateGroup
                  key={date}
                  date={date}
                  notifications={dateNotifications}
                  onMarkAsRead={onMarkAsRead}
                />
              ),
            )}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-10 text-center">
            <Check className="mb-4 h-12 w-12 text-emerald-300" />
            <h3 className="font-semibold text-lg">All caught up!</h3>
            <p className="text-muted-foreground text-sm">
              You've read all your notifications
            </p>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
