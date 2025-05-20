"use client"

import {
  Eye,
  Users,
  FilePen,
  Printer,
  Receipt,
  Calendar,
  ClipboardCopy,
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
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdowns"
import { Avatar, AvatarFallback } from "@/components/ui/images"
import { Checkbox } from "@/components/ui/checkboxes"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import { motion } from "framer-motion"
import { z } from "zod"

import type { ColumnDef } from "@tanstack/react-table"

export const LockerViolationsSchema = z.object({
  id: z.string(),
  dateOfInspection: z.number(),
  dateSet: z.number(),
  violators: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  totalFines: z.number(),
})

export type Violation = z.infer<typeof LockerViolationsSchema>

export const exampleLockerViolations: Violation[] = [
  {
    id: "v-2024-001",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 7,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 6,
    violators: [{ id: "2023-45678", name: "John Dela Cruz" }],
    totalFines: 250,
  },
  {
    id: "v-2024-002",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 3,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 3,
    violators: [{ id: "2023-56789", name: "Maria Garcia" }],
    totalFines: 500,
  },
  {
    id: "v-2024-003",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 10,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 9,
    violators: [
      { id: "2023-67890", name: "James Reyes" },
      { id: "2023-67891", name: "Rosa Mendez" },
    ],
    totalFines: 300,
  },
  {
    id: "v-2024-004",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 5,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 5,
    violators: [{ id: "2023-78901", name: "Sofia Mendoza" }],
    totalFines: 100,
  },
  {
    id: "v-2024-005",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 2,
    dateSet: Date.now() - 1000 * 60 * 60 * 24 * 2,
    violators: [
      { id: "2023-89012", name: "Antonio Villanueva" },
      { id: "2023-89013", name: "Elena Santos" },
      { id: "2023-89014", name: "Miguel Torres" },
    ],
    totalFines: 400,
  },
]

const ColumnHeader = ({
  icon,
  text,
}: { icon: React.ReactNode; text: string }) => (
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

const ViolationActions = ({ violation }: { violation: Violation }) => {
  const handleView = () => {
    console.log("View violation:", violation.id)
  }

  const handleEdit = () => {
    console.log("Edit violation:", violation.id)
  }

  const handlePrint = () => {
    console.log("Print violation:", violation.id)
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
            onClick={() => navigator.clipboard.writeText(violation.id)}
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
            <FilePen className="mr-2 h-3.5 w-3.5" />
            Edit Violation
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-3.5 w-3.5" />
            Print Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Improved date cell with formatting and tooltip
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

// Enhanced ID cell
const IdCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium font-mono text-xs">{value}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <span>ID: {value}</span>
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

// Enhanced violators cell
const ViolatorsCell = ({
  value,
}: { value: { id: string; name: string }[] }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="-space-x-2 flex items-center">
            {value.slice(0, 3).map((violator, index) => (
              <motion.div
                key={violator.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-full border-2 border-background"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-slate-200 text-[10px]">
                    {getInitials(violator.name)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            ))}
            {value.length > 3 && (
              <Badge className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 p-1 text-[10px] text-slate-700">
                +{value.length - 3}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="w-48">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium text-xs">Violators:</span>
            </div>
            <ul className="space-y-1">
              {value.map((violator) => (
                <li key={violator.id} className="text-xs">
                  • {violator.name}{" "}
                  <span className="font-mono text-muted-foreground">
                    ({violator.id})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Enhanced amount cell
const AmountCell = ({ value }: { value: number }) => {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium text-xs">{formatted}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            <span>Total Fines: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

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
    accessorKey: "dateOfInspection",
    header: () => (
      <ColumnHeader
        icon={<Calendar className="h-3.5 w-3.5" />}
        text="Inspection Date"
      />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("dateOfInspection")} />,
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "dateSet",
    header: () => (
      <ColumnHeader
        icon={<Calendar className="h-3.5 w-3.5" />}
        text="Date Set"
      />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("dateSet")} />,
    sortingFn: "datetime",
    size: 120,
  },
  {
    accessorKey: "violators",
    header: () => (
      <ColumnHeader icon={<Users className="h-3.5 w-3.5" />} text="Violators" />
    ),
    cell: ({ row }) => <ViolatorsCell value={row.getValue("violators")} />,
    size: 150,
  },
  {
    accessorKey: "totalFines",
    header: () => (
      <ColumnHeader
        icon={<Receipt className="h-3.5 w-3.5" />}
        text="Total Fines"
      />
    ),
    cell: ({ row }) => <AmountCell value={row.getValue("totalFines")} />,
    size: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ViolationActions violation={row.original} />,
    size: 50,
  },
]
