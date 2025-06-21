"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Box,
  Calendar,
  Check,
  ClipboardCopy,
  Clock,
  Eye,
  MoreHorizontal,
  Package,
  Pencil,
  Printer,
  Receipt,
  User,
  Users,
} from "lucide-react"
import { z } from "zod"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Checkbox } from "@/components/ui/checkboxes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"

export const IgpManagementSchema = z.object({
  id: z.string(),
  purchaser: z.object({
    name: z.string(),
    course: z.string(),
    set: z.string(),
  }),
  batch: z.string(),
  quantity: z.number(),
  dateBought: z.number(),
  status: z.enum(["received", "pending"]),
  price: z.number().optional(),
  itemName: z.string().optional(),
})

export type Igp = z.infer<typeof IgpManagementSchema>

export const exampleIgpManagementData: Igp[] = [
  {
    id: "txn-2024-001",
    purchaser: {
      name: "Juan Dela Cruz",
      course: "BSIT",
      set: "A",
    },
    batch: "Batch 2023-A",
    quantity: 2,
    dateBought: Date.now() - 1000 * 60 * 60 * 24 * 3,
    status: "received",
    itemName: "DNSC T-Shirt",
    price: 350,
  },
  {
    id: "txn-2024-002",
    purchaser: {
      name: "Maria Santos",
      course: "BSCS",
      set: "B",
    },
    batch: "Batch 2023-B",
    quantity: 1,
    dateBought: Date.now() - 1000 * 60 * 60 * 24 * 1,
    status: "pending",
    itemName: "ID Lace",
    price: 150,
  },
  {
    id: "txn-2024-003",
    purchaser: {
      name: "Pedro Reyes",
      course: "BSBA",
      set: "C",
    },
    batch: "Batch 2023-A",
    quantity: 3,
    dateBought: Date.now() - 1000 * 60 * 60 * 24 * 5,
    status: "received",
    itemName: "Eco Bag",
    price: 200,
  },
  {
    id: "txn-2024-004",
    purchaser: {
      name: "Angela Garcia",
      course: "BSN",
      set: "D",
    },
    batch: "Batch 2023-C",
    quantity: 5,
    dateBought: Date.now() - 1000 * 60 * 60 * 24 * 2,
    status: "pending",
    itemName: "Button Pin Set",
    price: 75,
  },
  {
    id: "txn-2024-005",
    purchaser: {
      name: "Miguel Torres",
      course: "BSA",
      set: "A",
    },
    batch: "Batch 2023-B",
    quantity: 2,
    dateBought: Date.now() - 1000 * 60 * 60 * 24 * 7,
    status: "received",
    itemName: "University Calendar",
    price: 120,
  },
  {
    id: "txn-2024-006",
    purchaser: {
      name: "Sofia Mendoza",
      course: "BSED",
      set: "B",
    },
    batch: "Batch 2023-C",
    quantity: 1,
    dateBought: Date.now() - 1000 * 60 * 60 * 24 * 4,
    status: "received",
    itemName: "College Jacket",
    price: 850,
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

const SelectCell = ({ row, table = undefined }: { row?: any; table?: any }) => {
  if (table) {
    return (
      <div className="px-1">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </div>
    )
  }

  return (
    <div className="px-1">
      <Checkbox
        checked={row?.getIsSelected()}
        onCheckedChange={(value) => row?.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    </div>
  )
}

const TransactionIdCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium font-mono text-xs">{value}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <span>Transaction ID: {value}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={() => navigator.clipboard.writeText(value)}
            >
              <ClipboardCopy className="h-3 w-3" />
              <span className="sr-only">Copy ID</span>
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const PurchaserCell = ({
  value,
}: {
  value: { name: string; course: string; set: string }
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col">
            <span className="font-medium text-xs">{value.name}</span>
            <span className="text-[10px] text-muted-foreground">
              {value.course} - Set {value.set}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium text-xs">Purchaser Details:</span>
            </div>
            <ul className="space-y-0.5 text-xs">
              <li>Name: {value.name}</li>
              <li>Course: {value.course}</li>
              <li>Set: {value.set}</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const BatchCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-slate-50 font-normal text-xs">
            {value}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Batch: {value}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const QuantityCell = ({ value, price }: { value: number; price?: number }) => {
  const formatted = new Intl.NumberFormat("en-PH").format(value)
  const totalPrice = price ? value * price : undefined

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              <span>Quantity: {formatted} items</span>
            </div>
            {price && totalPrice && (
              <div className="flex items-center gap-1.5 text-xs">
                <Receipt className="h-3.5 w-3.5" />
                <span>
                  Total:{" "}
                  {totalPrice.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </span>
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
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const StatusCell = ({ value }: { value: "received" | "pending" }) => {
  return (
    <Badge
      variant={value === "received" ? "success" : "outline"}
      className={
        value === "received"
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      }
    >
      <span className="flex items-center gap-1 text-xs">
        {value === "received" ? (
          <Check className="h-3 w-3" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        {value === "received" ? "Received" : "Pending"}
      </span>
    </Badge>
  )
}

const SupplyActions = ({ supply }: { supply: Igp }) => {
  const handleView = () => {
    console.log("View supply transaction:", supply.id)
  }

  const handleEdit = () => {
    console.log("Edit supply transaction:", supply.id)
  }

  const handleMarkReceived = () => {
    console.log("Mark as received:", supply.id)
  }

  const handlePrint = () => {
    console.log("Print receipt:", supply.id)
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
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => navigator.clipboard.writeText(supply.id)}
          >
            <ClipboardCopy className="mr-2 h-3.5 w-3.5" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
            Edit Transaction
          </DropdownMenuItem>
          {supply.status === "pending" && (
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={handleMarkReceived}
            >
              <Check className="mr-2 h-3.5 w-3.5" />
              Mark as Received
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-3.5 w-3.5" />
            Print Receipt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const igpManagementColumn: ColumnDef<Igp>[] = [
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
    cell: ({ row }) => <PurchaserCell value={row.getValue("purchaser")} />,
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
        price={row.original.price}
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
    accessorKey: "status",
    header: () => (
      <ColumnHeader icon={<Box className="h-3.5 w-3.5" />} text="Status" />
    ),
    cell: ({ row }) => <StatusCell value={row.getValue("status")} />,
    size: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <SupplyActions supply={row.original} />,
    size: 50,
  },
]
