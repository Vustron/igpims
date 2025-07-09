"use client"

import { Badge } from "@/components/ui/badges"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import { cn } from "@/utils/cn"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  BarChart2,
  Calendar,
  Droplet,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

export const AnimatedCalendar = ({ date }: { date: Date }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center text-xs">
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="mr-2">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
            </motion.div>
            {format(date, "MMM d, yyyy")}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{format(date, "EEEE, MMMM d, yyyy")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const AnimatedGallonsBadge = ({ value }: { value: number }) => {
  const getGallonsIndicator = (val: number) => {
    if (val >= 6)
      return {
        color: "bg-blue-500/20 text-blue-700 border-blue-200",
        label: "High",
      }
    if (val >= 3)
      return {
        color: "bg-emerald-500/20 text-emerald-700 border-emerald-200",
        label: "Medium",
      }
    return {
      color: "bg-amber-500/20 text-amber-700 border-amber-200",
      label: "Low",
    }
  }

  const indicator = getGallonsIndicator(value)

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="inline-flex">
      <Badge
        variant="outline"
        className={cn(
          "flex items-center gap-1 px-2 py-0.5 font-medium text-xs",
          indicator.color,
        )}
      >
        <Droplet className="h-3 w-3" />
        {value} gal
        <span className="ml-1 rounded-sm bg-white/50 px-1 py-0.5 text-[10px]">
          {indicator.label}
        </span>
      </Badge>
    </motion.div>
  )
}

export const FinancialValue = ({
  value,
  type,
}: {
  value: number
  type: "revenue" | "expenses" | "profit"
}) => {
  const config = {
    revenue: {
      icon: TrendingUp,
      color: "text-blue-600",
      bgHover: "group-hover:bg-blue-50",
      tooltip: "Revenue generated",
    },
    expenses: {
      icon: TrendingDown,
      color: "text-red-600",
      bgHover: "group-hover:bg-red-50",
      tooltip: "Expenses incurred",
    },
    profit: {
      icon: BarChart2,
      color: value >= 0 ? "text-emerald-600" : "text-red-600",
      bgHover:
        value >= 0 ? "group-hover:bg-emerald-50" : "group-hover:bg-red-50",
      tooltip: value >= 0 ? "Profit earned" : "Loss incurred",
    },
  }

  const { icon: Icon, color, bgHover, tooltip } = config[type]
  const formattedValue = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`font-medium text-xs ${color} group rounded-md px-2 py-1 transition-colors ${bgHover}`}
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-1.5">
              <Icon className="h-3 w-3" />
              <span>{formattedValue}</span>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">
            {tooltip}: {formattedValue}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const getCellClassNames = (columnMeta?: Record<string, any>): string => {
  return cn(
    "p-3 align-middle [&:has([role=checkbox])]:pr-0",
    columnMeta?.className,
  )
}
