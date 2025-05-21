"use client"

import {
  Eye,
  Box,
  Clock,
  Truck,
  Boxes,
  Pencil,
  Receipt,
  Calendar,
  ArrowRight,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { Button } from "@/components/ui/buttons"
import { Progress } from "@/components/ui/progress"

import { z } from "zod"

import type { ColumnDef } from "@tanstack/react-table"

export const SupplySchema = z.object({
  id: z.string(),
  quantity: z.number(),
  dateReceived: z.number(),
  price: z.number(),
  expenses: z.number(),
  itemsGiven: z.number(),
})

export type Supply = z.infer<typeof SupplySchema>

export const exampleSupplyData: Supply[] = [
  {
    id: "sup-2024-001",
    quantity: 500,
    dateReceived: Date.now() - 1000 * 60 * 60 * 24 * 30,
    price: 350,
    expenses: 140000,
    itemsGiven: 215,
  },
  {
    id: "sup-2024-002",
    quantity: 1000,
    dateReceived: Date.now() - 1000 * 60 * 60 * 24 * 25,
    price: 150,
    expenses: 120000,
    itemsGiven: 762,
  },
  {
    id: "sup-2024-003",
    quantity: 300,
    dateReceived: Date.now() - 1000 * 60 * 60 * 24 * 20,
    price: 200,
    expenses: 55000,
    itemsGiven: 189,
  },
  {
    id: "sup-2024-004",
    quantity: 800,
    dateReceived: Date.now() - 1000 * 60 * 60 * 24 * 15,
    price: 75,
    expenses: 48000,
    itemsGiven: 421,
  },
  {
    id: "sup-2024-005",
    quantity: 200,
    dateReceived: Date.now() - 1000 * 60 * 60 * 24 * 10,
    price: 120,
    expenses: 21600,
    itemsGiven: 98,
  },
  {
    id: "sup-2024-006",
    quantity: 100,
    dateReceived: Date.now() - 1000 * 60 * 60 * 24 * 5,
    price: 850,
    expenses: 76500,
    itemsGiven: 12,
  },
  {
    id: "sup-2024-007",
    quantity: 250,
    dateReceived: Date.now() - 1000 * 60 * 60 * 24 * 2,
    price: 180,
    expenses: 43200,
    itemsGiven: 0,
  },
]

const ColumnHeader = ({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) => (
  <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
    {icon}
    <span>{text}</span>
  </div>
)

const ItemsSuppliedCell = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat("en-PH").format(value)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            <span>Total items supplied: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ExpensesCell = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-red-600 text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            <span>Total expenses: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ItemsGivenCell = ({ given, total }: { given: number; total: number }) => {
  const percentage = Math.round((given / total) * 100)
  const remaining = total - given

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs">
              <span>{given.toLocaleString()}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-1.5" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5" />
              <span>Items distribution:</span>
            </div>
            <ul className="space-y-0.5 text-xs">
              <li>Given: {given.toLocaleString()}</li>
              <li>Remaining: {remaining.toLocaleString()}</li>
              <li>Total: {total.toLocaleString()}</li>
              <li>Utilization: {percentage}%</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ItemsLeftCell = ({ given, total }: { given: number; total: number }) => {
  const remaining = total - given
  const percentage = Math.round((remaining / total) * 100)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`font-medium text-xs ${remaining < total * 0.2 ? "text-amber-600" : "text-green-600"}`}
          >
            {remaining.toLocaleString()} ({percentage}%)
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5" />
              <span>
                Remaining inventory: {remaining.toLocaleString()} items
              </span>
            </div>
            {remaining < total * 0.2 && (
              <div className="flex items-center gap-1.5 text-amber-600 text-xs">
                <Clock className="h-3.5 w-3.5" />
                <span>Low inventory warning</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const DateCell = ({ value }: { value: number }) => {
  const date = new Date(value)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="whitespace-nowrap text-xs">{formattedDate}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const SupplyActions = ({ supply }: { supply: Supply }) => {
  const handleView = () => {
    console.log("View supply details:", supply.id)
  }

  const handleEdit = () => {
    console.log("Edit supply:", supply.id)
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleView}
          >
            <Eye className="mr-2 h-3.5 w-3.5" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleEdit}
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit Supply
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const igpSupplyColumns: ColumnDef<Supply>[] = [
  {
    accessorKey: "dateReceived",
    header: () => (
      <ColumnHeader
        icon={<Calendar className="h-3.5 w-3.5" />}
        text="Date Received"
      />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("dateReceived")} />,
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
    accessorKey: "itemsGiven",
    header: () => (
      <ColumnHeader
        icon={<ArrowRight className="h-3.5 w-3.5" />}
        text="Items Given"
      />
    ),
    cell: ({ row }) => (
      <ItemsGivenCell
        given={row.getValue("itemsGiven")}
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
      <ItemsLeftCell
        given={row.original.itemsGiven}
        total={row.original.quantity}
      />
    ),
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <SupplyActions supply={row.original} />,
    size: 50,
  },
]
