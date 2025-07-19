"use client"

import { IgpTransactionWithIgp } from "@/backend/actions/igp-transaction/find-many"
import { DateCell } from "@/features/locker-igp/violations/column-helpers"
import { ColumnDef } from "@tanstack/react-table"
import {
  Box,
  Calendar,
  ClipboardCopy,
  Package,
  User,
  Users,
} from "lucide-react"
import { IgpTransactionAction } from "./actions"
import {
  BatchCell,
  ColumnHeader,
  PurchaserCell,
  QuantityCell,
  StatusCell,
  TransactionIdCell,
} from "./column-helper"

export const igpManagementColumn: ColumnDef<IgpTransactionWithIgp>[] = [
  {
    accessorKey: "id",
    header: () => (
      <ColumnHeader
        icon={<ClipboardCopy className="ml-5 h-3.5 w-3.5" />}
        text="Transaction ID"
      />
    ),
    cell: ({ row }) => <TransactionIdCell value={row.getValue("id")} />,
    size: 100,
  },
  {
    accessorKey: "purchaser",
    header: () => (
      <ColumnHeader icon={<User className="h-3.5 w-3.5" />} text="Purchaser" />
    ),
    cell: ({ row }) => (
      <PurchaserCell
        purchaserName={row.original.purchaserName}
        courseAndSet={row.original.courseAndSet}
      />
    ),
    size: 150,
  },
  {
    accessorKey: "batch",
    header: () => (
      <ColumnHeader icon={<Users className="h-3.5 w-3.5" />} text="Batch" />
    ),
    cell: ({ row }) => <BatchCell value={row.getValue("batch")} />,
    size: 100,
  },
  {
    accessorKey: "quantity",
    header: () => (
      <ColumnHeader
        icon={<Package className="h-3.5 w-3.5" />}
        text="Quantity"
      />
    ),
    cell: ({ row }) => (
      <QuantityCell
        value={row.getValue("quantity")}
        price={row.original?.igp?.costPerItem}
      />
    ),
    size: 80,
  },
  {
    accessorKey: "dateBought",
    header: () => (
      <ColumnHeader
        icon={<Calendar className="h-3.5 w-3.5" />}
        text="Date Bought"
      />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("dateBought")} />,
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "itemReceived",
    header: () => (
      <ColumnHeader icon={<Box className="h-3.5 w-3.5" />} text="Status" />
    ),
    cell: ({ row }) => <StatusCell value={row.getValue("itemReceived")} />,
    size: 60,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <IgpTransactionAction igp={row.original} />,
    size: 50,
  },
]
