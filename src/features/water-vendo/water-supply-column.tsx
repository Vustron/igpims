"use client"

import { z } from "zod"
import { format } from "date-fns"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { Button } from "@/components/ui/buttons"
import { MoreHorizontal, CalendarIcon, Droplet } from "lucide-react"

import type { ColumnDef } from "@tanstack/react-table"

// Zod schema for water supply data
export const WaterSupplySchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  suppliedGallons: z.number().nonnegative(),
  expenses: z.number().nonnegative(),
  usedGallons: z.number().nonnegative(),
})

// Type definition from the schema
export type WaterSupply = z.infer<typeof WaterSupplySchema>

// Example data for water supply
export const exampleWaterSupplies: WaterSupply[] = [
  {
    id: "WS-2023-001",
    date: new Date(2023, 5, 15), // June 15, 2023
    suppliedGallons: 25,
    expenses: 500,
    usedGallons: 5,
  },
  {
    id: "WS-2023-002",
    date: new Date(2023, 6, 2), // July 2, 2023
    suppliedGallons: 15,
    expenses: 100,
    usedGallons: 3,
  },
  {
    id: "WS-2023-003",
    date: new Date(2023, 7, 14), // August 14, 2023
    suppliedGallons: 18,
    expenses: 750,
    usedGallons: 12,
  },
  {
    id: "WS-2023-004",
    date: new Date(2023, 8, 30), // September 30, 2023
    suppliedGallons: 5,
    expenses: 120,
    usedGallons: 2,
  },
  {
    id: "WS-2023-005",
    date: new Date(2023, 10, 5), // November 5, 2023
    suppliedGallons: 3,
    expenses: 75,
    usedGallons: 3,
  },
  {
    id: "WS-2024-001",
    date: new Date(2024, 0, 18), // January 18, 2024
    suppliedGallons: 20,
    expenses: 500,
    usedGallons: 18,
  },
]

// Column definitions for water supply list
export const waterSupplyListColumn: ColumnDef<WaterSupply>[] = [
  {
    accessorKey: "id",
    header: "Supply ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{format(date, "MMM d, yyyy")}</span>
        </div>
      )
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "suppliedGallons",
    header: "Supplied Gallons",
    cell: ({ row }) => {
      const amount = Number.parseInt(row.getValue("suppliedGallons"))
      return (
        <div className="flex items-center">
          <Droplet className="mr-2 h-4 w-4 text-blue-500" />
          <span>{amount.toLocaleString()} gal</span>
        </div>
      )
    },
  },
  {
    accessorKey: "expenses",
    header: "Expenses",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("expenses"))
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
      return <span className="font-medium">{formatted}</span>
    },
  },
  {
    accessorKey: "usedGallons",
    header: "Used Gallons",
    cell: ({ row }) => {
      const used = Number.parseInt(row.getValue("usedGallons"))
      const supplied = Number.parseInt(row.getValue("suppliedGallons"))
      const percentage = Math.round((used / supplied) * 100)

      return (
        <div className="flex items-center">
          <span>{used.toLocaleString()} gal</span>
          <span className="ml-2 text-muted-foreground text-xs">
            ({percentage}%)
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supply = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(supply.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("View details", supply)}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit supply", supply)}
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
