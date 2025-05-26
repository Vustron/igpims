import { Badge } from "@/components/ui/badges"
import { Calendar } from "lucide-react"
import { cn } from "@/utils/cn"

import type { IgpType, SalesData } from "@/features/report/sales-report-types"
import type { ColumnDef } from "@tanstack/react-table"

export const salesReportColumn = (): ColumnDef<SalesData>[] => [
  {
    accessorKey: "id",
    header: "Sale ID",
    cell: ({ row }) => (
      <span className="font-medium text-xs">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue<Date>("date")
      return (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs">{date.toLocaleDateString()}</span>
        </div>
      )
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "igpType",
    header: "IGP Type",
    cell: ({ row }) => {
      const igpType = row.getValue<IgpType>("igpType")
      const colorMap: Record<IgpType, string> = {
        lockerRental: "bg-blue-50 text-blue-700 border-blue-200",
        waterVendo: "bg-teal-50 text-teal-700 border-teal-200",
        merchandise: "bg-purple-50 text-purple-700 border-purple-200",
        buttonPins: "bg-amber-50 text-amber-700 border-amber-200",
        tshirts: "bg-emerald-50 text-emerald-700 border-emerald-200",
        ecoBags: "bg-indigo-50 text-indigo-700 border-indigo-200",
      }

      const labelMap: Record<IgpType, string> = {
        lockerRental: "Locker Rental",
        waterVendo: "Water Vendo",
        merchandise: "Merchandise",
        buttonPins: "Button Pins",
        tshirts: "T-shirts",
        ecoBags: "Eco Bags",
      }

      return (
        <Badge
          variant="outline"
          className={cn("font-medium text-xs", colorMap[igpType])}
        >
          {labelMap[igpType]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "itemName",
    header: "Item",
    cell: ({ row }) => (
      <span className="text-xs">{row.getValue("itemName")}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="text-xs">{row.getValue<number>("quantity")}</span>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => {
      const amount = row.getValue<number>("unitPrice")
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
      return <span className="text-xs">{formatted}</span>
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = row.getValue<number>("totalAmount")
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
      return <span className="font-medium text-xs">{formatted}</span>
    },
  },
  {
    accessorKey: "profit",
    header: "Profit",
    cell: ({ row }) => {
      const profit = row.getValue<number>("profit")
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(profit)
      return (
        <span
          className={cn(
            "font-medium text-xs",
            profit >= 0 ? "text-emerald-600" : "text-red-600",
          )}
        >
          {formatted}
        </span>
      )
    },
  },
]
