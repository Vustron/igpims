"use client"

import {
  AmountCell,
  SelectCell,
  DateDueCell,
  LockerIdCell,
  RenterNameCell,
  DateRentedCell,
  CourseAndSetCell,
  RentalStatusCell,
  PaymentStatusCell,
  TransactionIdCell,
} from "@/features/locker-rental-list/table-cells"
import { columnHeaders } from "@/features/locker-rental-list/column-helper"
import { ActionMenu } from "@/features/locker-rental-list/action-menu"

import type { LockerRental } from "@/schemas/drizzle-schema"
import type { ColumnDef } from "@tanstack/react-table"

export const lockerRentalListColumns: ColumnDef<LockerRental>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectCell table={table} />,
    cell: ({ row }) => <SelectCell row={row} />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "transactionId",
    header: "ID",
    cell: ({ row }) => {
      const transactionId = row.getValue("transactionId") as string
      return <TransactionIdCell value={transactionId} />
    },
    size: 90,
  },
  {
    accessorKey: "lockerId",
    header: "Locker",
    cell: ({ row }) => {
      const lockerId = row.getValue("lockerId") as string
      return <LockerIdCell value={lockerId} />
    },
    size: 80,
  },
  {
    accessorKey: "renterName",
    header: columnHeaders.renter,
    cell: ({ row }) => {
      const renterName = row.getValue("renterName") as string
      return <RenterNameCell value={renterName} />
    },
    size: 120,
  },
  {
    accessorKey: "courseAndSet",
    header: columnHeaders.course,
    cell: ({ row }) => {
      const courseAndSet = row.getValue("courseAndSet") as string
      return <CourseAndSetCell value={courseAndSet} />
    },
    size: 80,
  },
  {
    accessorKey: "rentalStatus",
    header: columnHeaders.status,
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
    header: columnHeaders.payment,
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string
      return <PaymentStatusCell value={status} />
    },
    size: 100,
  },
  {
    accessorKey: "dateRented",
    header: columnHeaders.rental,
    cell: ({ row }) => {
      const timestamp = row.getValue("dateRented") as number
      return <DateRentedCell value={timestamp} />
    },
    sortingFn: "datetime",
    size: 80,
  },
  {
    accessorKey: "dateDue",
    header: columnHeaders.due,
    cell: ({ row }) => {
      const timestamp = row.getValue("dateDue") as number
      return <DateDueCell value={timestamp} />
    },
    sortingFn: "datetime",
    size: 100,
  },
  {
    accessorKey: "amount",
    header: columnHeaders.amount,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return <AmountCell value={amount} />
    },
    size: 80,
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
