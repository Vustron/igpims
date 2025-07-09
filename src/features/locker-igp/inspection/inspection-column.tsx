"use client"

import { Inspection } from "@/backend/db/schemas"
import { Button } from "@/components/ui/buttons"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Calendar,
  ClipboardCopy,
  Receipt,
  Users,
} from "lucide-react"
import { InspectionActions } from "./actions"
import { AmountCell, DateCell, IdCell, ViolatorsCell } from "./column-helpers"

export const inspectionColumn: ColumnDef<Inspection>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <ClipboardCopy className="mr-2 h-3 w-3" />
        Transaction ID
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <IdCell value={row.getValue("id")} />,
    size: 80,
  },
  {
    accessorKey: "dateOfInspection",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Calendar className="mr-2 h-3 w-3" />
        Inspection Date
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("dateOfInspection") as number
      return <DateCell value={timestamp} />
    },
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "dateSet",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Calendar className="mr-2 h-3 w-3" />
        Date Set
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("dateSet") as number
      return <DateCell value={timestamp} />
    },
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "violators",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Users className="mr-2 h-3 w-3" />
        Violators
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <ViolatorsCell value={row.getValue("violators")} />,
    accessorFn: (row) => {
      try {
        if (!row.violators) return []
        if (typeof row.violators === "string") {
          return JSON.parse(row.violators)
        }
        return Array.isArray(row.violators) ? row.violators : []
      } catch (e) {
        return []
      }
    },
    size: 150,
  },
  {
    accessorKey: "totalFines",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Receipt className="mr-2 h-3 w-3" />
        Total Fines
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <AmountCell value={row.getValue("totalFines")} />,
    size: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <InspectionActions inspection={row.original} />,
    size: 50,
  },
]
