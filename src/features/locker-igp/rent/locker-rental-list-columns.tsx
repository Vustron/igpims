"use client"

import { LockerRental } from "@/backend/db/schemas"
import { Button } from "@/components/ui/buttons"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Box,
  Calendar,
  CreditCard,
  Hash,
  User,
} from "lucide-react"
import { ActionMenu } from "./action-menu"
import {
  CourseAndSetCell,
  DateDueCell,
  DateRentedCell,
  IdCell,
  LockerIdCell,
  PaymentStatusCell,
  RentalStatusCell,
  RenterNameCell,
} from "./table-cells"

export const lockerRentalListColumns: ColumnDef<LockerRental>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Hash className="mr-2 h-3 w-3" />
        Transaction ID
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const transactionId = row.getValue("id") as string
      return <IdCell value={transactionId} />
    },
    size: 90,
  },
  {
    accessorKey: "lockerId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Box className="mr-2 h-3 w-3" />
        Locker
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const lockerId = row.getValue("lockerId") as string
      return <LockerIdCell value={lockerId} />
    },
    size: 80,
  },
  {
    accessorKey: "renterName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <User className="mr-2 h-3 w-3" />
        Renter
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const renterName = row.getValue("renterName") as string
      return <RenterNameCell value={renterName} />
    },
    size: 120,
  },
  {
    accessorKey: "courseAndSet",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        Course
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const courseAndSet = row.getValue("courseAndSet") as string
      return <CourseAndSetCell value={courseAndSet} />
    },
    size: 80,
  },
  {
    accessorKey: "rentalStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        Status
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("rentalStatus") as string
      return <RentalStatusCell value={status} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    size: 100,
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <CreditCard className="mr-2 h-3 w-3" />
        Payment
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string
      return <PaymentStatusCell value={status} />
    },
    size: 100,
  },
  {
    accessorKey: "dateRented",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Calendar className="mr-2 h-3 w-3" />
        Rental Date
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("dateRented") as number
      return <DateRentedCell value={timestamp} />
    },
    sortingFn: "datetime",
    size: 80,
  },
  {
    accessorKey: "dateDue",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        <Calendar className="mr-2 h-3 w-3" />
        Due Date
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("dateDue") as number
      return <DateDueCell value={timestamp} />
    },
    sortingFn: "datetime",
    size: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const rental = row.original
      return <ActionMenu rental={rental} />
    },
    size: 50,
  },
]
