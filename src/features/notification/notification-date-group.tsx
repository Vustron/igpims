import { NotificationWithActorData } from "@/backend/actions/notification/find-many"
import { Badge } from "@/components/ui/badges"
import { AnimatePresence } from "framer-motion"
import { NotificationItem } from "./notification-item"

interface NotificationDateGroupProps {
  date: string
  notifications: NotificationWithActorData[]
  onMarkAsRead: (id: string) => void
  isUpdatingNotification?: boolean
}

export const NotificationDateGroup = ({
  date,
  notifications,
  onMarkAsRead,
  isUpdatingNotification = false,
}: NotificationDateGroupProps) => {
  return (
    <div className="space-y-2">
      <div className="sticky top-0 flex items-center gap-2 bg-white py-2">
        <Badge variant="outline" className="bg-slate-100 font-medium">
          {date}
        </Badge>
        <div className="flex-grow border-slate-200 border-t" />
      </div>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            isUpdatingNotification={isUpdatingNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
