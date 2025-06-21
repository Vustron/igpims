"use client"

import { format } from "date-fns"
import { Calendar, ClipboardCopy } from "lucide-react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Checkbox } from "@/components/ui/checkboxes"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import {
  getPaymentStatusStyle,
  getRemainingDays,
  getRentalStatusStyle,
} from "@/utils/locker-rental-utils"
import {
  getPaymentDescription,
  getPaymentIcon,
  getStatusDescription,
  getStatusIcon,
} from "./rental-status-indicators"

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
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    </div>
  )
}

export const IdCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="ml-2 max-w-[80px] truncate font-medium font-mono text-xs md:text-sm">
            {value.substring(0, 8)}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1">
            <span>{value}</span>
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

export const LockerIdCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="font-medium text-xs md:text-sm">
            {value.substring(1, 3)}-{value.substring(3, 6)}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <span>Full ID: {value}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const RenterNameCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[120px] truncate font-medium">{value}</div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <span>{value}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const CourseAndSetCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[80px] truncate text-xs">{value}</div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <span>{value}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const RentalStatusCell = ({ value }: { value: string }) => {
  const status = value
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            {/* Icon always visible */}
            <span>{getStatusIcon(status)}</span>

            {/* Badge only visible on larger screens */}
            <span className="hidden md:inline-flex">
              <Badge
                className={`${getRentalStatusStyle(status)} whitespace-nowrap text-[10px] md:text-xs`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <span className="font-medium">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            {getStatusDescription(status)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const PaymentStatusCell = ({ value }: { value: string }) => {
  const status = value
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            {/* Icon always visible */}
            <span>{getPaymentIcon(status)}</span>

            {/* Badge only visible on larger screens */}
            <span className="hidden md:inline-flex">
              <Badge
                className={`${getPaymentStatusStyle(status)} whitespace-nowrap text-[10px] md:text-xs`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {getPaymentIcon(status)}
            <span className="font-medium">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            {getPaymentDescription(status)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const DateRentedCell = ({ value }: { value: string | number }) => {
  const date = typeof value === "string" ? new Date(value) : new Date(value)

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

export const DateDueCell = ({ value }: { value: string | number }) => {
  const date = typeof value === "string" ? new Date(value) : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return (
      <div className="whitespace-nowrap text-red-500 text-xs">Invalid Date</div>
    )
  }

  const timestamp = date.getTime()
  const daysRemaining = getRemainingDays(timestamp)
  const formattedDate = format(date, "MMM dd, yyyy")

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col">
            <div className="whitespace-nowrap text-xs">{formattedDate}</div>
            <div
              className={`whitespace-nowrap text-[10px] ${
                daysRemaining < 0
                  ? "text-red-500"
                  : daysRemaining < 7
                    ? "text-amber-500"
                    : "text-emerald-500"
              }`}
            >
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)}d late`
                : daysRemaining === 0
                  ? "Due today"
                  : `${daysRemaining}d left`}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              {format(date, "PPP")}
            </div>
            <div
              className={`text-xs ${
                daysRemaining < 0
                  ? "text-red-500"
                  : daysRemaining < 7
                    ? "text-amber-500"
                    : "text-emerald-500"
              }`}
            >
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)} days overdue`
                : daysRemaining === 0
                  ? "Due today"
                  : `${daysRemaining} days remaining`}
            </div>
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

  return (
    <div className="text-right font-medium text-xs md:text-sm">{formatted}</div>
  )
}
