"use client"

import { ViolationWithRenters } from "@/backend/actions/violation/find-many"
import { Button } from "@/components/ui/buttons"
import { ColumnDef } from "@tanstack/react-table"
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  Package,
  Receipt,
  User,
} from "lucide-react"
import { BiCard } from "react-icons/bi"
import { ViolationActions } from "./actions"
import {
  AmountCell,
  DateCell,
  IdCell,
  LockerCell,
  PaymentStatusCell,
  RenterNameCell,
  ViolationCell,
} from "./column-helpers"

export const violationListColumns: ColumnDef<ViolationWithRenters>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="ml-2 font-medium text-xs"
      >
        <BiCard className="mr-2 h-3 w-3" />
        Transaction ID
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="ml-5">
        <IdCell value={row.getValue("id")} />
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <User className="mr-2 h-3 w-3" />
        Student
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <RenterNameCell value={row.getValue("studentName")} />,
    size: 140,
  },
  {
    accessorKey: "lockerId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Package className="mr-2 h-3 w-3" />
        Locker
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <LockerCell value={row.getValue("lockerId")} />,
    size: 100,
  },
  {
    accessorKey: "violations",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <AlertCircle className="mr-2 h-3 w-3" />
        Violations
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <ViolationCell value={row.getValue("violations")} />,
    size: 150,
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
        Inspection
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
    accessorKey: "datePaid",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Calendar className="mr-2 h-3 w-3" />
        Date Paid
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("datePaid") as number
      return <DateCell value={timestamp} />
    },
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "totalFine",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Receipt className="mr-2 h-3 w-3" />
          Fine
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <AmountCell value={row.getValue("totalFine")} />,
    size: 80,
  },
  {
    accessorKey: "fineStatus",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <Receipt className="mr-2 h-3 w-3" />
          Status
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <PaymentStatusCell value={row.getValue("fineStatus")} />
      </div>
    ),
    size: 50,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ViolationActions violation={row.original} />,
    size: 50,
  },
]
