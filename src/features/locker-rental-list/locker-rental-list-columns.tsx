"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdowns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import {
  Ban,
  Eye,
  Tag,
  Edit,
  User,
  Trash2,
  Clock,
  Wallet,
  ShieldX,
  Printer,
  Calendar,
  TimerReset,
  CreditCard,
  ShieldCheck,
  WalletCards,
  ShieldAlert,
  CircleDashed,
  AlertTriangle,
  ClipboardCopy,
  MoreHorizontal,
  ShieldQuestion,
} from "lucide-react"

import { Checkbox } from "@/components/ui/checkboxes"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import {
  formatDate,
  getRemainingDays,
  getRentalStatusStyle,
  getPaymentStatusStyle,
} from "@/utils/locker-rental-utils"

import type { LockerRental } from "@/schemas/drizzle-schema"
import type { ColumnDef } from "@tanstack/react-table"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return (
        <ShieldCheck className="size-4 text-emerald-500" aria-hidden="true" />
      )
    case "expired":
      return <ShieldAlert className="size-4 text-red-500" aria-hidden="true" />
    case "cancelled":
      return <ShieldX className="size-4 text-slate-500" aria-hidden="true" />
    case "pending":
      return (
        <ShieldQuestion className="size-4 text-amber-500" aria-hidden="true" />
      )
    default:
      return (
        <CircleDashed className="size-4 text-slate-500" aria-hidden="true" />
      )
  }
}

const getPaymentIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <Wallet className="size-4 text-emerald-500" aria-hidden="true" />
    case "pending":
      return <TimerReset className="size-4 text-amber-500" aria-hidden="true" />
    case "partial":
      return <WalletCards className="size-4 text-blue-500" aria-hidden="true" />
    case "overdue":
      return (
        <AlertTriangle className="size-4 text-red-500" aria-hidden="true" />
      )
    default:
      return <CreditCard className="size-4 text-slate-500" aria-hidden="true" />
  }
}

export const lockerRentalListColumns: ColumnDef<LockerRental>[] = [
  {
    id: "select",
    header: ({ table }) => (
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
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "transactionId",
    header: "ID",
    cell: ({ row }) => {
      const transactionId = row.getValue("transactionId") as string
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[80px] truncate font-medium font-mono text-xs md:text-sm">
                {transactionId.substring(0, 8)}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="flex items-center gap-1">
                <span>{transactionId}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5"
                  onClick={() => navigator.clipboard.writeText(transactionId)}
                >
                  <ClipboardCopy className="h-3 w-3" />
                  <span className="sr-only">Copy ID</span>
                </Button>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 90,
  },
  {
    accessorKey: "lockerId",
    header: "Locker",
    cell: ({ row }) => {
      const lockerId = row.getValue("lockerId") as string

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium text-xs md:text-sm">
                {lockerId.substring(1, 3)}-{lockerId.substring(3, 6)}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Full ID: {lockerId}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 80,
  },
  {
    accessorKey: "renterName",
    header: () => (
      <div className="flex items-center gap-1">
        <User className="size-3.5" />
        <span>Renter</span>
      </div>
    ),
    cell: ({ row }) => {
      const renterName = row.getValue("renterName") as string
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[120px] truncate font-medium">
                {renterName}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>{renterName}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 120,
  },
  {
    accessorKey: "courseAndSet",
    header: () => (
      <div className="flex items-center gap-1">
        <Tag className="size-3.5" />
        <span>Course</span>
      </div>
    ),
    cell: ({ row }) => {
      const courseAndSet = row.getValue("courseAndSet") as string
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[80px] truncate text-xs">
                {courseAndSet}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>{courseAndSet}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 80,
  },
  {
    accessorKey: "rentalStatus",
    header: () => (
      <div className="flex items-center gap-1">
        <ShieldCheck className="size-3.5" />
        <span>Status</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("rentalStatus") as string
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
                {status === "active" && "Locker rental is currently active"}
                {status === "expired" && "Rental period has ended"}
                {status === "cancelled" && "Rental was cancelled"}
                {status === "pending" && "Waiting for approval"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    size: 100,
  },
  {
    accessorKey: "paymentStatus",
    header: () => (
      <div className="flex items-center gap-1">
        <Wallet className="size-3.5" />
        <span>Payment</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string
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
                {status === "paid" && "Full payment received"}
                {status === "pending" && "Payment not yet received"}
                {status === "partial" && "Partial payment made"}
                {status === "overdue" && "Payment is past due"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 100,
  },
  {
    accessorKey: "dateRented",
    header: () => (
      <div className="flex items-center gap-1">
        <Calendar className="size-3.5" />
        <span>Rental</span>
      </div>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("dateRented") as number

      const date = new Date(timestamp)
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="whitespace-nowrap text-xs">{formattedDate}</div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {formatDate(timestamp)}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    sortingFn: "datetime",
    size: 80,
  },
  {
    accessorKey: "dateDue",
    header: () => (
      <div className="flex items-center gap-1">
        <Clock className="size-3.5" />
        <span>Due</span>
      </div>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("dateDue") as number
      const daysRemaining = getRemainingDays(timestamp)

      const date = new Date(timestamp)
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)

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
                  {formatDate(timestamp)}
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
    },
    sortingFn: "datetime",
    size: 100,
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="flex items-center justify-end gap-1">
        <CreditCard className="size-3.5" />
        <span>Amount</span>
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number

      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)

      return (
        <div className="text-right font-medium text-xs md:text-sm">
          {formatted}
        </div>
      )
    },
    size: 80,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const rental = row.original

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(rental.id)}
                className="text-xs"
              >
                <ClipboardCopy className="mr-2 h-3.5 w-3.5" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                <Eye className="mr-2 h-3.5 w-3.5" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                <Edit className="mr-2 h-3.5 w-3.5" />
                Edit rental
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                <Printer className="mr-2 h-3.5 w-3.5" />
                Print receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {rental.rentalStatus === "active" && (
                <DropdownMenuItem className="text-amber-600 text-xs">
                  <Ban className="mr-2 h-3.5 w-3.5" />
                  Cancel rental
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600 text-xs">
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete rental
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    size: 50,
  },
]
