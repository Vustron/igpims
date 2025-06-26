"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Calendar, ClipboardCopy, Receipt, Users } from "lucide-react"
import { Inspection } from "@/backend/db/schemas"
import { InspectionActions } from "./actions"
import {
  AmountCell,
  ColumnHeader,
  DateCell,
  IdCell,
  ViolatorsCell,
} from "./column-helpers"

export const inspectionColumn: ColumnDef<Inspection>[] = [
  {
    accessorKey: "id",
    header: () => (
      <ColumnHeader
        icon={<ClipboardCopy className="h-3.5 w-3.5" />}
        text="Transaction ID"
      />
    ),
    cell: ({ row }) => <IdCell value={row.getValue("id")} />,
    size: 80,
  },
  {
    accessorKey: "dateOfInspection",
    header: () => (
      <ColumnHeader
        icon={<Calendar className="h-3.5 w-3.5" />}
        text="Inspection Date"
      />
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
    header: () => (
      <ColumnHeader
        icon={<Calendar className="h-3.5 w-3.5" />}
        text="Date Set"
      />
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
    header: () => (
      <ColumnHeader icon={<Users className="h-3.5 w-3.5" />} text="Violators" />
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
    header: () => (
      <ColumnHeader
        icon={<Receipt className="h-3.5 w-3.5" />}
        text="Total Fines"
      />
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
