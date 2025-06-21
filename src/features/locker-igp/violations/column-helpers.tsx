"use client"

import { format } from "date-fns/format"
import {
  AlertCircle,
  Calendar,
  ClipboardCopy,
  Package,
  Receipt,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Checkbox } from "@/components/ui/checkboxes"
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

// Updated ViolationCell to handle both string and array values
export const ViolationCell = ({ value }: { value: string[] | string }) => {
  const getBadgeColor = (violationType: string) => {
    switch (violationType.toLowerCase()) {
      case "lost_key":
      case "lost key":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "damaged_locker":
      case "damaged locker":
        return "bg-red-100 text-red-800 border-red-200"
      case "unauthorized_use":
      case "unauthorized use":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "prohibited_items":
      case "prohibited items":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "other":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getViolationLabel = (violation: string) => {
    switch (violation) {
      case "damaged_locker":
        return "Damaged Locker"
      case "lost_key":
        return "Lost Key"
      case "unauthorized_use":
        return "Unauthorized Use"
      case "prohibited_items":
        return "Prohibited Items"
      case "other":
        return "Other"
      default:
        return (
          violation.charAt(0).toUpperCase() +
          violation.slice(1).replace("_", " ")
        )
    }
  }

  let violations: string[] = []
  try {
    if (typeof value === "string") {
      violations = JSON.parse(value)
    } else if (Array.isArray(value)) {
      violations = value
    }
  } catch (error) {
    violations = typeof value === "string" ? [value] : []
  }

  violations = violations.filter((v) => v && v.trim() !== "")

  if (!violations || violations.length === 0) {
    return <span className="text-muted-foreground text-xs">No violations</span>
  }

  const primaryViolation = violations[0]
  const hasMultiple = violations.length > 1

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <Badge
              className={`${getBadgeColor(primaryViolation!)} border font-medium text-xs`}
              variant="outline"
            >
              {getViolationLabel(primaryViolation!)}
            </Badge>
            {hasMultiple && (
              <Badge variant="secondary" className="text-xs">
                +{violations.length - 1}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Violations ({violations.length})</span>
            </div>
            <div className="space-y-1">
              {violations.map((violation, index) => (
                <div key={index} className="text-xs">
                  • {getViolationLabel(violation)}
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const DateCell = ({ value }: { value: number }) => {
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

export const IdCell = ({ value }: { value: string }) => {
  const shortId = value.slice(0, 8)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium font-mono text-muted-foreground text-xs transition-colors hover:text-foreground">
            {shortId}...
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs">{value}</span>
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

export const LockerCell = ({ value }: { value: string }) => {
  const shortId = value.slice(0, 8)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <Package className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium font-mono text-muted-foreground text-xs transition-colors hover:text-foreground">
              {shortId}...
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            <span>Locker ID: {value}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={() => navigator.clipboard.writeText(value)}
            >
              <ClipboardCopy className="h-3 w-3" />
              <span className="sr-only">Copy Locker ID</span>
            </Button>
          </div>
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
          <div className="ml-5 flex items-center gap-1.5">
            <span className="max-w-[120px] truncate font-medium text-xs">
              {value}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>Student: {value}</span>
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

  const isHighAmount = value >= 1000
  const isMediumAmount = value >= 500

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`font-medium text-xs ${
              isHighAmount
                ? "text-red-600"
                : isMediumAmount
                  ? "text-amber-600"
                  : "text-foreground"
            }`}
          >
            {formatted}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            <span>Total Fine: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const PaymentStatusCell = ({ value }: { value: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "unpaid":
        return "bg-red-100 text-red-800 border-red-200"
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "waived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "under_review":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "under_review":
        return "Under Review"
      case "partial":
        return "Partial"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <Badge
      className={`${getStatusStyles(value)} border text-xs`}
      variant="outline"
    >
      {getStatusLabel(value)}
    </Badge>
  )
}
