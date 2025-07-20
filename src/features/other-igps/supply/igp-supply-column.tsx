"use client"

import { DateCell } from "@/features/locker-igp/violations/column-helpers"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, Box, Calendar, Receipt, Truck } from "lucide-react"

import { IgpSupply } from "@/backend/db/schemas"
import { SupplyActions } from "./actions"
import {
  ColumnHeader,
  ExpensesCell,
  ItemsGivenCell,
  ItemsLeftCell,
  ItemsSuppliedCell,
} from "./column-helpers"

export const igpSupplyColumns: ColumnDef<IgpSupply>[] = [
  {
    accessorKey: "supplyDate",
    header: () => (
      <div className="ml-5">
        <ColumnHeader
          icon={<Calendar className="h-3.5 w-3.5" />}
          text="Supply Date"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="ml-5">
        <DateCell value={row.getValue("supplyDate")} />
      </div>
    ),
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "quantity",
    header: () => (
      <ColumnHeader
        icon={<Truck className="h-3.5 w-3.5" />}
        text="Items Supplied"
      />
    ),
    cell: ({ row }) => <ItemsSuppliedCell value={row.getValue("quantity")} />,
    size: 120,
  },
  {
    accessorKey: "expenses",
    header: () => (
      <ColumnHeader
        icon={<Receipt className="h-3.5 w-3.5" />}
        text="Expenses"
      />
    ),
    cell: ({ row }) => <ExpensesCell value={row.getValue("expenses")} />,
    size: 120,
  },
  {
    accessorKey: "quantitySold",
    header: () => (
      <ColumnHeader
        icon={<ArrowRight className="h-3.5 w-3.5" />}
        text="Items Given"
      />
    ),
    cell: ({ row }) => (
      <ItemsGivenCell
        given={row.getValue("quantitySold")}
        total={row.original.quantity}
      />
    ),
    size: 150,
  },
  {
    id: "itemsLeft",
    header: () => (
      <ColumnHeader icon={<Box className="h-3.5 w-3.5" />} text="Items Left" />
    ),
    cell: ({ row }) => (
      <div className="ml-5">
        <ItemsLeftCell
          given={row.original.quantitySold}
          total={row.original.quantity}
        />
      </div>
    ),
    size: 50,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="mr-5">
        <SupplyActions supply={row.original} />
      </div>
    ),
    size: 50,
  },
]
