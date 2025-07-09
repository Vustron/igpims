"use client"

import { WaterFundWithVendoLocation } from "@/backend/actions/water-fund/find-by-id"
import { Button } from "@/components/ui/buttons"
import { DateCell } from "@/features/locker-igp/violations/column-helpers"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Calendar,
  DollarSign,
  Droplet,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { WaterFundActions } from "./actions"
import { AnimatedGallonsBadge, FinancialValue } from "./column-helpers"

export const waterFundColumn: ColumnDef<WaterFundWithVendoLocation>[] = [
  {
    accessorKey: "waterVendoLocation",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0 font-medium text-xs"
          >
            <MapPin className="mr-2 h-3 w-3" />
            <span className="hidden sm:inline">Water Vendo</span>
            <span className="inline sm:hidden">Location</span>
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center font-medium text-xs">
        <MapPin className="ml-5 mr-1.5 h-3 w-3 text-slate-400" />
        {row.getValue("waterVendoLocation")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "dateFund",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Calendar className="mr-2 h-3 w-3" />
        Date
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("dateFund") as number
      return <DateCell value={timestamp} />
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "usedGallons",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap font-medium text-xs"
      >
        <Droplet className="mr-2 h-3 w-3" />
        <span className="hidden sm:inline">Gallons Used</span>
        <span className="inline sm:hidden">Gallons</span>
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <AnimatedGallonsBadge value={row.getValue("usedGallons")} />
    ),
    enableHiding: true,
  },
  {
    accessorKey: "waterFundsExpenses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <DollarSign className="mr-2 h-3 w-3" />
          <span>Expenses</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <FinancialValue
        value={row.getValue<number>("waterFundsExpenses")}
        type="expenses"
      />
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "waterFundsRevenue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <DollarSign className="mr-2 h-3 w-3" />
          <span>Revenue</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <FinancialValue
        value={row.getValue<number>("waterFundsRevenue")}
        type="revenue"
      />
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "waterFundsProfit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <TrendingUp className="mr-2 h-3 w-3" />
          <span>Profit</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <FinancialValue
        value={row.getValue<number>("waterFundsProfit")}
        type="profit"
      />
    ),
    enableHiding: false,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <WaterFundActions fund={row.original} />,
    enableHiding: false,
  },
]
