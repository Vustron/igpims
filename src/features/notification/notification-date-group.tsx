import { AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badges"
import { NotificationItem } from "./notification-item"
import { Notification } from "./notification-types"

interface NotificationDateGroupProps {
  date: string
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}

export const NotificationDateGroup = ({
  date,
  notifications,
  onMarkAsRead,
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
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
