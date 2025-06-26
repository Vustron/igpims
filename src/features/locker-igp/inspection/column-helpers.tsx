"use client"

import { format } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, ClipboardCopy, Receipt, Users } from "lucide-react"
import React from "react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Checkbox } from "@/components/ui/checkboxes"
import { Avatar, AvatarFallback } from "@/components/ui/images"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"

export const ColumnHeader = ({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) => (
  <div className="ml-5 flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
    {icon}
    <span>{text}</span>
  </div>
)

export const SelectCell = ({
  row,
  table = undefined,
}: {
  row?: any
  table?: any
}) => {
  if (table) {
    return (
      <div className="px-1">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </div>
    )
  }

  return (
    <div className="px-1">
      <Checkbox
        checked={row?.getIsSelected()}
        onCheckedChange={(value) => row?.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    </div>
  )
}

export const DateCell = ({ value }: { value: number }) => {
  let date: Date

  if (typeof value === "string") {
    date = new Date(value)
  } else {
    const isLikelyMicroseconds = value > 1e15
    date = new Date(isLikelyMicroseconds ? value / 1000 : value)
  }

  if (Number.isNaN(date.getTime())) {
    return (
      <div className="whitespace-nowrap text-red-500 text-xs">Invalid Date</div>
    )
  }

  const formattedDate = format(date, "MMM dd, yyyy")

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="whitespace-nowrap text-xs">{formattedDate}</div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            {format(date, "PPP")}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const IdCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-5 font-medium font-mono text-xs">{value}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <span>ID: {value}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={() => navigator.clipboard.writeText(value)}
            >
              <ClipboardCopy className="h-3 w-3" />
              <span className="sr-only">Copy ID</span>
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const ViolatorsCell = ({
  value,
}: {
  value:
    | { id: string; name?: string; studentName?: string }[]
    | string[]
    | string
}) => {
  const violators = React.useMemo(() => {
    if (!value) return []

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          return parsed.map((v) => {
            if (typeof v === "string") return { id: v, name: v }
            return {
              id: v.id || v.violatorId || "N/A",
              name: v.name || v.studentName || "Unknown",
            }
          })
        }
        return []
      } catch (e) {
        return []
      }
    }

    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      return value.map((id) => ({ id, name: id }))
    }

    if (Array.isArray(value)) {
      return value.map((v) => {
        if (typeof v === "string") return { id: v, name: v }
        return {
          id: v.id || "N/A",
          name: v.name || v.studentName || "Unknown",
        }
      })
    }

    return []
  }, [value])

  if (violators.length === 0) {
    return (
      <div className="ml-5 text-muted-foreground text-xs">No violators yet</div>
    )
  }

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "NA"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="-space-x-2 ml-5 flex items-center">
            {violators.slice(0, 3).map((violator, index) => (
              <motion.div
                key={violator.id || index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-full border-2 border-background"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-slate-200 text-[10px]">
                    {getInitials(violator.name)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            ))}
            {violators.length > 3 && (
              <Badge className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 p-1 text-[10px] text-slate-700">
                +{violators.length - 3}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="w-48">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium text-xs">Violators:</span>
            </div>
            <ul className="space-y-1">
              {violators.map((violator, index) => (
                <li key={violator.id || index} className="text-xs">
                  • {violator.name || "Unknown"}{" "}
                  <span className="font-mono text-muted-foreground">
                    ({violator.id || "N/A"})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
export const AmountCell = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  if (!value || value === 0) {
    return (
      <span className="ml-5 text-muted-foreground text-xs">No fines yet</span>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-5 font-medium text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            <span>Total Fines: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
