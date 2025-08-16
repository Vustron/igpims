"use client"

import { WaterSupplyWithVendoLocation } from "@/backend/actions/water-supply/find-by-id"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { DateCell } from "@/features/locker-igp/violations/column-helpers"
import { cn } from "@/utils/cn"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Banknote,
  CalendarDays,
  Droplet,
  GlassWaterIcon,
  Hash,
  Store,
  Timer,
} from "lucide-react"
import { Actions } from "./actions"

export const waterSupplyListColumn: ColumnDef<WaterSupplyWithVendoLocation>[] =
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
          Supply ID
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
      accessorKey: "supplyDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <CalendarDays className="mr-2 h-3 w-3" />
          Supply Date
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("supplyDate") as number
        return <DateCell value={timestamp} />
      },
    },
    {
      accessorKey: "vendoLocation",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Store className="mr-2 h-3 w-3" />
          Location
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 shrink-0 text-purple-500" />
          <span className="max-w-[150px] truncate sm:max-w-[200px]">
            {row.getValue("vendoLocation")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "suppliedGallons",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Droplet className="mr-2 h-3 w-3" />
          Supplied
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseInt(row.getValue("suppliedGallons"), 10)
        return (
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 shrink-0 text-blue-500" />
            <Badge variant="outline" className="whitespace-nowrap font-medium">
              {amount.toLocaleString()} gal
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "expenses",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Banknote className="mr-2 h-3 w-3" />
          Expenses
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseInt(row.getValue("expenses"), 10)
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
      accessorKey: "usedGallons",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <GlassWaterIcon className="mr-2 h-3 w-3" />
          Used
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const used = Number.parseInt(row.getValue("usedGallons"), 10)
        const supplied = Number.parseInt(row.getValue("suppliedGallons"), 10)
        const percentage = Math.round((used / supplied) * 100) || 0
        const colorClass = cn("transition-colors", {
          "text-red-500": percentage > 75,
          "text-yellow-500": percentage <= 75 && percentage > 25,
          "text-green-500": percentage <= 25,
        })

        return (
          <div className="flex items-center gap-2">
            <GlassWaterIcon className={cn("h-4 w-4 shrink-0", colorClass)} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="whitespace-nowrap text-xs">
                {used.toLocaleString()} gal
              </span>
              <Badge
                variant="outline"
                className={cn("hidden text-xs sm:inline-flex", colorClass)}
              >
                {percentage}%
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "remainingGallons",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Timer className="mr-2 h-3 w-3" />
          Remaining
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const remaining = Number.parseInt(row.getValue("remainingGallons"), 10)
        const supplied = Number.parseInt(row.getValue("suppliedGallons"), 10)
        const percentage = Math.round((remaining / supplied) * 100) || 0
        const colorClass = cn("transition-colors", {
          "text-red-500": percentage < 25,
          "text-yellow-500": percentage >= 25 && percentage < 75,
          "text-green-500": percentage >= 75,
        })

        return (
          <div className="flex items-center gap-2">
            <Timer className={cn("h-4 w-4 shrink-0", colorClass)} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="whitespace-nowrap text-sm sm:text-base">
                {remaining.toLocaleString()} gal
              </span>
              <Badge
                variant="outline"
                className={cn("hidden text-xs sm:inline-flex", colorClass)}
              >
                {percentage}%
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <Actions supply={row.original} />,
    },
  ]
