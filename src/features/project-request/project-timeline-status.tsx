import { Badge } from "@/components/ui/badges"
import { cn } from "@/utils/cn"

import type { ProjectRequest } from "@/features/project-request/project-request-store"

export const TimelineStatusBadge = ({
  status,
}: {
  status: ProjectRequest["status"]
}) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "outline",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    in_review: {
      label: "In Review",
      variant: "outline",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    checking: {
      label: "Checking",
      variant: "outline",
      className: "bg-purple-50 text-purple-700 border-purple-200",
    },
    approved: {
      label: "Approved",
      variant: "outline",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    in_progress: {
      label: "In Progress",
      variant: "outline",
      className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    completed: {
      label: "Completed",
      variant: "outline",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    rejected: {
      label: "Rejected",
      variant: "outline",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs sm:text-sm", config.className)}
    >
      {config.label}
    </Badge>
  )
}
