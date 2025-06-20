"use client"

import {
  User,
  Receipt,
  Calendar,
  AlertCircle,
  ClipboardCopy,
} from "lucide-react"

import {
  IdCell,
  DateCell,
  AmountCell,
  SelectCell,
  ColumnHeader,
  ViolationCell,
  RenterNameCell,
  PaymentStatusCell,
} from "./column-helpers"
import { ViolationActions } from "./actions"

import type { ColumnDef } from "@tanstack/react-table"
import type { Violation } from "@/validation/violation"

export const violationListColumns: ColumnDef<Violation>[] = [
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
    accessorKey: "studentName",
    header: () => (
      <ColumnHeader icon={<User className="h-3.5 w-3.5" />} text="Student" />
    ),
    cell: ({ row }) => <RenterNameCell value={row.getValue("studentName")} />,
    size: 120,
  },
  {
    accessorKey: "violations",
    header: () => (
      <ColumnHeader
        icon={<AlertCircle className="h-3.5 w-3.5" />}
        text="Violation"
      />
    ),
    cell: ({ row }) => <ViolationCell value={row.getValue("violations")} />,
    size: 120,
  },
  {
    accessorKey: "dateOfInspection",
    header: () => (
      <ColumnHeader icon={<Calendar className="h-3.5 w-3.5" />} text="Date" />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("dateOfInspection")} />,
    sortingFn: "datetime",
    size: 100,
  },
  {
    accessorKey: "totalFine",
    header: () => (
      <ColumnHeader icon={<Receipt className="h-3.5 w-3.5" />} text="Fine" />
    ),
    cell: ({ row }) => <AmountCell value={row.getValue("totalFine")} />,
    size: 80,
  },
  {
    accessorKey: "fineStatus",
    header: () => (
      <ColumnHeader icon={<Receipt className="h-3.5 w-3.5" />} text="Status" />
    ),
    cell: ({ row }) => <PaymentStatusCell value={row.getValue("fineStatus")} />,
    size: 90,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ViolationActions violation={row.original} />,
    size: 50,
  },
]
