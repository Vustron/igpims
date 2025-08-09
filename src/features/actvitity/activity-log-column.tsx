"use client"

import { ActivityWithUser } from "@/backend/actions/activity/find-many"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/images"
import { DateCell } from "@/features/locker-igp/violations/column-helpers"
import { cn } from "@/utils/cn"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Briefcase,
  CalendarDays,
  Crown,
  Hash,
  MessageSquare,
  Shield,
  User,
  Users,
} from "lucide-react"

const getRoleInfo = (role: string) => {
  const roleMap = {
    admin: {
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      label: "Admin",
    },
    ssc_president: {
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      label: "President",
    },
    ssc_treasurer: {
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50",
      label: "Treasurer",
    },
    ssc_auditor: {
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      label: "Auditor",
    },
    chief_legislator: {
      icon: Shield,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      label: "Chief Legislator",
    },
    legislative_secretary: {
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      label: "Legislative Secretary",
    },
    dpdm_secretary: {
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      label: "DPDM Secretary",
    },
    dpdm_officers: {
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-50",
      label: "DPDM Officer",
    },
    ssc_officer: {
      icon: Users,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      label: "SSC Officer",
    },
    student: {
      icon: User,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      label: "Student",
    },
    user: {
      icon: User,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      label: "User",
    },
  }
  return roleMap[role as keyof typeof roleMap] || roleMap.user
}

export const activityLogColumn: ColumnDef<ActivityWithUser>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs hover:bg-gray-50"
      >
        <Hash className="mr-2 h-3 w-3" />
        Activity ID
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="ml-5 w-[80px] truncate sm:w-auto">
        <Badge variant="outline" className="font-mono text-xs bg-gray-50">
          {row.getValue("id")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs hover:bg-gray-50"
      >
        <CalendarDays className="mr-2 h-3 w-3" />
        Date & Time
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("createdAt") as number
      return (
        <div className="flex items-center gap-2">
          <DateCell value={timestamp} />
        </div>
      )
    },
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs hover:bg-gray-50"
      >
        <User className="mr-2 h-3 w-3" />
        User
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const userData = row.original.userData

      if (!userData) {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-200">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 italic">Unknown User</span>
              <Badge variant="outline" className="text-xs w-fit">
                Deleted
              </Badge>
            </div>
          </div>
        )
      }

      const roleInfo = getRoleInfo(userData.role)
      const RoleIcon = roleInfo.icon

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
            <AvatarImage
              src={userData.image || undefined}
              alt={userData.name}
            />
            <AvatarFallback
              className={cn(
                "text-xs font-medium",
                roleInfo.bgColor,
                roleInfo.color,
              )}
            >
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-[160px]">
                {userData.name}
              </span>
              <RoleIcon className={cn("h-3 w-3 shrink-0", roleInfo.color)} />
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs px-2 py-0.5 font-medium",
                  roleInfo.bgColor,
                  roleInfo.color,
                )}
              >
                {roleInfo.label}
              </Badge>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs hover:bg-gray-50"
      >
        <MessageSquare className="mr-2 h-3 w-3" />
        Action Description
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const action = row.getValue("action") as string

      const getActionType = (actionText: string) => {
        const lowerAction = actionText.toLowerCase()
        if (
          lowerAction.includes("create") ||
          lowerAction.includes("add") ||
          lowerAction.includes("submit")
        ) {
          return {
            color: "text-green-600",
            bgColor: "bg-green-50 border-green-200",
            variant: "secondary" as const,
            icon: "📝",
          }
        }
        if (
          lowerAction.includes("update") ||
          lowerAction.includes("edit") ||
          lowerAction.includes("modify")
        ) {
          return {
            color: "text-blue-600",
            bgColor: "bg-blue-50 border-blue-200",
            variant: "secondary" as const,
            icon: "✏️",
          }
        }
        if (
          lowerAction.includes("delete") ||
          lowerAction.includes("remove") ||
          lowerAction.includes("cancel")
        ) {
          return {
            color: "text-red-600",
            bgColor: "bg-red-50 border-red-200",
            variant: "destructive" as const,
            icon: "🗑️",
          }
        }
        if (lowerAction.includes("login") || lowerAction.includes("signin")) {
          return {
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 border-emerald-200",
            variant: "secondary" as const,
            icon: "🔑",
          }
        }
        if (lowerAction.includes("logout") || lowerAction.includes("signout")) {
          return {
            color: "text-orange-600",
            bgColor: "bg-orange-50 border-orange-200",
            variant: "secondary" as const,
            icon: "🚪",
          }
        }
        if (lowerAction.includes("approve") || lowerAction.includes("accept")) {
          return {
            color: "text-teal-600",
            bgColor: "bg-teal-50 border-teal-200",
            variant: "secondary" as const,
            icon: "✅",
          }
        }
        if (lowerAction.includes("reject") || lowerAction.includes("deny")) {
          return {
            color: "text-pink-600",
            bgColor: "bg-pink-50 border-pink-200",
            variant: "secondary" as const,
            icon: "❌",
          }
        }
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50 border-gray-200",
          variant: "outline" as const,
          icon: "ℹ️",
        }
      }

      const { color, bgColor, variant, icon } = getActionType(action)

      return (
        <div className="flex items-start gap-3 py-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-lg">{icon}</span>
            <div className="flex-1 min-w-0">
              <Badge
                variant={variant}
                className={cn(
                  "whitespace-normal text-left font-normal leading-relaxed border px-3 py-2",
                  bgColor,
                  color,
                )}
              >
                <span className="break-words text-sm leading-tight">
                  {action}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      )
    },
  },
]
