"use client"

import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import {
  ArrowRight,
  Boxes,
  Calendar,
  Clock,
  TrendingDown,
  Truck,
} from "lucide-react"

export const ColumnHeader = ({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) => (
  <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
    {icon}
    <span>{text}</span>
  </div>
)

export const ItemsSuppliedCell = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat("en-PH").format(value)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            <span>Total items supplied: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const ExpensesCell = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-red-600 text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            <span>Total expenses: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const ItemsGivenCell = ({
  given,
  total,
}: {
  given: number
  total: number
}) => {
  const percentage = Math.round((given / total) * 100)
  const remaining = total - given

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs">
              <span>{given.toLocaleString()}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-1.5" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5" />
              <span>Items distribution:</span>
            </div>
            <ul className="space-y-0.5 text-xs">
              <li>Given: {given.toLocaleString()}</li>
              <li>Remaining: {remaining.toLocaleString()}</li>
              <li>Total: {total.toLocaleString()}</li>
              <li>Utilization: {percentage}%</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const ItemsLeftCell = ({
  given,
  total,
}: {
  given: number
  total: number
}) => {
  const remaining = total - given
  const percentage = Math.round((remaining / total) * 100)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`font-medium text-xs ${remaining < total * 0.2 ? "text-amber-600" : "text-green-600"}`}
          >
            {remaining.toLocaleString()} ({percentage}%)
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5" />
              <span>
                Remaining inventory: {remaining.toLocaleString()} items
              </span>
            </div>
            {remaining < total * 0.2 && (
              <div className="flex items-center gap-1.5 text-amber-600 text-xs">
                <Clock className="h-3.5 w-3.5" />
                <span>Low inventory warning</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const DateCell = ({ value }: { value: number }) => {
  const date = new Date(value)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="whitespace-nowrap text-xs">{formattedDate}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
