"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, Calendar, Package, Receipt, User } from "lucide-react"
import { Violation } from "@/backend/db/schemas"
import { ViolationActions } from "./actions"
import {
  AmountCell,
  ColumnHeader,
  DateCell,
  LockerCell,
  PaymentStatusCell,
  RenterNameCell,
  ViolationCell,
} from "./column-helpers"

export const violationListColumns: ColumnDef<Violation>[] = [
  {
    accessorKey: "studentName",
    header: () => (
      <ColumnHeader icon={<User className="h-3.5 w-3.5" />} text="Student" />
    ),
    cell: ({ row }) => <RenterNameCell value={row.getValue("studentName")} />,
    size: 140,
  },
  {
    accessorKey: "lockerId",
    header: () => (
      <ColumnHeader icon={<Package className="h-3.5 w-3.5" />} text="Locker" />
    ),
    cell: ({ row }) => <LockerCell value={row.getValue("lockerId")} />,
    size: 100,
  },
  {
    accessorKey: "violations",
    header: () => (
      <ColumnHeader
        icon={<AlertCircle className="h-3.5 w-3.5" />}
        text="Violations"
      />
    ),
    cell: ({ row }) => <ViolationCell value={row.getValue("violations")} />,
    size: 150,
  },
  {
    accessorKey: "dateOfInspection",
    header: () => (
      <ColumnHeader
        icon={<Calendar className="h-3.5 w-3.5" />}
        text="Inspection"
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
    size: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ViolationActions violation={row.original} />,
    size: 50,
  },
]
