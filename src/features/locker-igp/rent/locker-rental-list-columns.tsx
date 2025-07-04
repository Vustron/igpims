"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LockerRental } from "@/backend/db/schemas"
import { ActionMenu } from "./action-menu"
import { columnHeaders } from "./column-helper"
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
    header: () => <div className="ml-2">Transaction Id</div>,
    cell: ({ row }) => {
      const transactionId = row.getValue("id") as string
      return <IdCell value={transactionId} />
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
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const rental = row.original
      return <ActionMenu rental={rental} />
    },
    size: 50,
  },
]
