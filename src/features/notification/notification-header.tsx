import { BellRing, Check, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"

interface NotificationHeaderProps {
  unreadCount: number
  onMarkAllAsRead: () => void
  onRefresh: () => void
}

export const NotificationHeader = ({
  unreadCount,
  onMarkAllAsRead,
  onRefresh,
}: NotificationHeaderProps) => {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="flex items-center gap-2 font-bold text-2xl">
          <BellRing className="h-6 w-6" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="bg-blue-500 text-white">{unreadCount}</Badge>
          )}
        </h1>
        <p className="text-muted-foreground text-sm">
          Track updates on your fund requests and IGP proposals
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="gap-1.5"
        >
          <Check className="h-4 w-4" />
          Mark all as read
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
