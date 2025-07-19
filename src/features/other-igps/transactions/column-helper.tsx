"use client"

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
  Calendar,
  Check,
  ClipboardCopy,
  Clock,
  Package,
  Receipt,
  User,
  Users,
  X,
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

export const SelectCell = ({
  row,
  table = undefined,
}: { row?: any; table?: any }) => {
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

export const TransactionIdCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-5 font-medium font-mono text-xs">{value}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <span>Transaction ID: {value}</span>
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

export const PurchaserCell = ({
  purchaserName,
  courseAndSet,
}: {
  purchaserName: string
  courseAndSet: string
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col">
            <span className="font-medium text-xs">{purchaserName}</span>
            <span className="text-[10px] text-muted-foreground">
              {courseAndSet}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium text-xs">Purchaser Details:</span>
            </div>
            <ul className="space-y-0.5 text-xs">
              <li>Name: {purchaserName}</li>
              <li>Course & Set: {courseAndSet}</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const BatchCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-slate-50 font-normal text-xs">
            {value}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Batch: {value}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const QuantityCell = ({
  value,
  price,
}: { value: number; price?: number }) => {
  const formatted = new Intl.NumberFormat("en-PH").format(value)
  const totalPrice = price ? value * price : undefined

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              <span>Quantity: {formatted} items</span>
            </div>
            {price && totalPrice && (
              <div className="flex items-center gap-1.5 text-xs">
                <Receipt className="h-3.5 w-3.5" />
                <span>
                  Total:{" "}
                  {totalPrice.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </span>
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
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const StatusCell = ({
  value,
}: { value: "received" | "pending" | "cancelled" }) => {
  const statusConfig = {
    received: {
      icon: <Check className="h-3 w-3" />,
      text: "Received",
      bgClass: "bg-green-100 text-green-800 hover:bg-green-200",
      variant: "success" as const,
    },
    pending: {
      icon: <Clock className="h-3 w-3" />,
      text: "Pending",
      bgClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      variant: "outline" as const,
    },
    cancelled: {
      icon: <X className="h-3 w-3" />,
      text: "Cancelled",
      bgClass: "bg-red-100 text-red-800 hover:bg-red-200",
      variant: "destructive" as const,
    },
  }

  const config = statusConfig[value]

  return (
    <Badge variant={config.variant} className={config.bgClass}>
      <span className="flex items-center gap-1 text-xs">
        {config.icon}
        {config.text}
      </span>
    </Badge>
  )
}
