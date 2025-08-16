"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock,
  Hash,
  ImageIcon,
  User,
  Wallet,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { ExpenseTransactionWithRequestor } from "@/backend/actions/expense-transaction/find-many"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { DateCell } from "@/features/locker-igp/violations/column-helpers"
import { useDialog } from "@/hooks/use-dialog"
import { cn } from "@/utils/cn"
import { Actions } from "./actions"

export const expenseTransactionListColumn: ColumnDef<ExpenseTransactionWithRequestor>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Hash className="mr-2 h-3 w-3" />
          Transaction ID
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-2 w-[80px] truncate sm:w-auto">
          <span className="font-medium font-mono">{row.getValue("id")}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <CalendarDays className="mr-2 h-3 w-3" />
          Date of Expense
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("date") as number
        return <DateCell value={timestamp} />
      },
    },
    {
      accessorKey: "requestor",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <User className="mr-2 h-3 w-3" />
          Requestor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 shrink-0 text-purple-500" />
          <span className="max-w-[150px] truncate sm:max-w-[200px]">
            {row.original.requestorData?.name || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "expenseName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Wallet className="mr-2 h-3 w-3" />
          Expense Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 shrink-0 text-blue-500" />
          <span className="max-w-[150px] truncate sm:max-w-[200px]">
            {row.getValue("expenseName")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Banknote className="mr-2 h-3 w-3" />
          Amount
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(amount)
        return (
          <div className="flex items-center justify-end gap-2 sm:justify-start">
            <Banknote className="h-4 w-4 shrink-0 text-green-500" />
            <Badge
              variant="secondary"
              className="whitespace-nowrap font-medium"
            >
              {formatted}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "receipt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <ImageIcon className="mr-2 h-3 w-3" />
          Receipt
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const receiptUrl = row.getValue("receipt") as string | null
        const { onOpen } = useDialog()

        if (!receiptUrl) {
          return (
            <div className="-ml-5 flex flex-col items-center gap-2">
              <ImageIcon className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-xs text-gray-500">No receipt</span>
            </div>
          )
        }

        return (
          <div className="-ml-5 flex flex-col items-center gap-2 cursor-pointer p-2">
            <Button
              onClick={() => onOpen("viewImage", { imgUrl: receiptUrl })}
              variant="ghost"
              className="rounded-2xl"
            >
              <Image
                src={receiptUrl}
                alt="Receipt"
                height={200}
                width={200}
                className="p-1 rounded-md border border-gray-200 w-8 h-8 object-contain"
              />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Clock className="mr-2 h-3 w-3" />
          Status
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const rejectionReason = row.original.rejectionReason
        const colorClass = cn({
          "text-red-500": status === "rejected",
          "text-yellow-500": status === "pending",
          "text-green-500": status === "validated",
        })

        const StatusIcon =
          {
            pending: Clock,
            validated: CheckCircle2,
            rejected: XCircle,
          }[status] || Clock

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-4 w-4 shrink-0", colorClass)} />
              <Badge
                variant="outline"
                className={cn("whitespace-nowrap font-medium", colorClass)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            {status === "rejected" && rejectionReason && (
              <div className="text-xs text-red-500 max-w-[200px] truncate">
                {rejectionReason}
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <Actions transaction={row.original} />,
    },
  ]
