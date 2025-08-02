"use client"

import { NotificationWithActorData } from "@/backend/actions/notification/find-many"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { cn } from "@/utils/cn"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import {
  getActionColor,
  getActionIcon,
  getActionLabel,
} from "./notification-helpers"

interface NotificationItemProps {
  notification: NotificationWithActorData
  onMarkAsRead: (id: string) => void
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative mb-2 rounded-lg border p-4 transition-all hover:bg-slate-50",
        notification.status === "unread"
          ? "border-l-4 border-l-blue-500 bg-blue-50/30"
          : "border-slate-200",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
            getActionColor(notification.action)
              .replace("bg-", "")
              .replace("text-", "bg-")
              .replace("700", "500"),
          )}
        >
          {getActionIcon(notification.action)}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            <span className="flex-shrink-0 text-slate-500 text-xs">
              {formatDateFromTimestamp(notification.createdAt)}
            </span>
          </div>

          <p className="text-slate-600 text-sm">{notification.description}</p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge
              variant="outline"
              className={getActionColor(notification.action)}
            >
              {getActionLabel(notification.action)}
            </Badge>

            <Badge
              variant="outline"
              className={
                notification.type === "fund_request"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }
            >
              {notification.type === "fund_request"
                ? "Fund Request"
                : "IGP Proposal"}
            </Badge>

            <span className="font-mono text-slate-500 text-xs">
              {notification.requestId}
            </span>
          </div>
        </div>
      </div>

      {notification.status === "unread" && (
        <Button
          onClick={() => onMarkAsRead(notification.id)}
          variant={"outline"}
          className="absolute top-12 right-8 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Mark as read</span>
        </Button>
      )}
    </motion.div>
  )
}
