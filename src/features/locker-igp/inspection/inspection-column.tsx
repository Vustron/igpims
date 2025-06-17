"use client"

import { Users, Receipt, Calendar, ClipboardCopy } from "lucide-react"

import {
  IdCell,
  DateCell,
  AmountCell,
  SelectCell,
  ColumnHeader,
  ViolatorsCell,
} from "./column-helpers"
import { InspectionActions } from "./actions"

import type { ColumnDef } from "@tanstack/react-table"
import type { Inspection } from "@/schemas/inspection"

export const inspectionColumn: ColumnDef<Inspection>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectCell table={table} />,
    cell: ({ row }) => <SelectCell row={row} />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "id",
    header: () => (
      <ColumnHeader
        icon={<ClipboardCopy className="h-3.5 w-3.5" />}
        text="ID"
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
    cell: ({ row }) => <DateCell value={row.getValue("dateOfInspection")} />,
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
    cell: ({ row }) => <DateCell value={row.getValue("dateSet")} />,
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "violators",
    header: () => (
      <ColumnHeader icon={<Users className="h-3.5 w-3.5" />} text="Violators" />
    ),
    cell: ({ row }) => <ViolatorsCell value={row.getValue("violators")} />,
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
