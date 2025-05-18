"use client"

import {
  Eye,
  User,
  FilePen,
  Printer,
  Receipt,
  Calendar,
  AlertCircle,
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
import { Checkbox } from "@/components/ui/checkboxes"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import { z } from "zod"

import type { ColumnDef } from "@tanstack/react-table"

export const ViolationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  violations: z.string(),
  violationType: z.enum([
    "lost_key",
    "damaged_locker",
    "unauthorized_use",
    "prohibited_items",
    "late_renewal",
    "abandoned_items",
    "other",
  ]),
  dateOfInspection: z.number(),
  dateReported: z.number(),
  totalFine: z.number(),
  amountPaid: z.number().optional(),
  fineStatus: z.enum(["paid", "unpaid", "partial", "waived", "under_review"]),
  lockerId: z.string(),
  description: z.string().optional(),
  reportedBy: z.string(),
  evidence: z.array(z.string()).optional(),
  resolutionNotes: z.string().optional(),
})

export type Violation = z.infer<typeof ViolationSchema>

export const exampleViolations: Violation[] = [
  {
    id: "v-2024-001",
    studentId: "2023-45678",
    studentName: "John Dela Cruz",
    violations: "Lost Key",
    violationType: "lost_key",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 7,
    dateReported: Date.now() - 1000 * 60 * 60 * 24 * 6,
    totalFine: 250,
    amountPaid: 250,
    fineStatus: "paid",
    lockerId: "L-A101",
    description: "Student reported losing locker key and requested replacement",
    reportedBy: "Michelle Santos",
    evidence: ["img-lost-key-001.jpg"],
    resolutionNotes: "Key replaced and fine paid in full on May 20, 2024",
  },
  {
    id: "v-2024-002",
    studentId: "2023-56789",
    studentName: "Maria Garcia",
    violations: "Damaged Locker",
    violationType: "damaged_locker",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 3,
    dateReported: Date.now() - 1000 * 60 * 60 * 24 * 3,
    totalFine: 500,
    amountPaid: 0,
    fineStatus: "unpaid",
    lockerId: "L-B205",
    description: "Door hinge broken due to misuse, requires repair",
    reportedBy: "Robert Tan",
    evidence: ["img-damage-001.jpg", "img-damage-002.jpg"],
  },
  {
    id: "v-2024-003",
    studentId: "2023-67890",
    studentName: "James Reyes",
    violations: "Unauthorized Use",
    violationType: "unauthorized_use",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 10,
    dateReported: Date.now() - 1000 * 60 * 60 * 24 * 9,
    totalFine: 300,
    amountPaid: 150,
    fineStatus: "partial",
    lockerId: "L-C310",
    description: "Locker being used by unauthorized student, policy violation",
    reportedBy: "Anna Lim",
    resolutionNotes:
      "Student agreed to payment plan, remaining balance due next week",
  },
  {
    id: "v-2024-004",
    studentId: "2023-78901",
    studentName: "Sofia Mendoza",
    violations: "Late Renewal",
    violationType: "late_renewal",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 5,
    dateReported: Date.now() - 1000 * 60 * 60 * 24 * 5,
    totalFine: 100,
    fineStatus: "waived",
    lockerId: "L-D415",
    description: "Failed to renew locker rental on time",
    reportedBy: "Carlos Santos",
    resolutionNotes: "Fine waived due to documented medical emergency",
  },
  {
    id: "v-2024-005",
    studentId: "2023-89012",
    studentName: "Antonio Villanueva",
    violations: "Prohibited Items",
    violationType: "prohibited_items",
    dateOfInspection: Date.now() - 1000 * 60 * 60 * 24 * 2,
    dateReported: Date.now() - 1000 * 60 * 60 * 24 * 2,
    totalFine: 400,
    fineStatus: "under_review",
    lockerId: "L-E520",
    description:
      "Found prohibited food items in locker causing odor, violation of policy",
    reportedBy: "Diana Ramos",
    evidence: ["img-prohibited-001.jpg"],
  },
]

// Column header component with icon
const ColumnHeader = ({
  icon,
  text,
}: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
    {icon}
    <span>{text}</span>
  </div>
)

// Select cell component
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

// Enhanced violation cell component
const ViolationCell = ({ value }: { value: string }) => {
  const getBadgeColor = (violationType: string) => {
    switch (violationType.toLowerCase()) {
      case "lost key":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "damaged locker":
        return "bg-red-100 text-red-800 border-red-200"
      case "unauthorized use":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "prohibited items":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "late renewal":
        return "bg-green-100 text-green-800 border-green-200"
      case "abandoned items":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={`${getBadgeColor(value)} border font-medium`}
            variant="outline"
          >
            {value}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Violation Type: {value}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Actions dropdown menu component
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

// Enhanced student name cell
const RenterNameCell = ({ value }: { value: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <span className="max-w-[100px] truncate font-medium text-xs">
              {value}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>Student: {value}</span>
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
            <span>Amount: {formatted}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Improved payment status cell
const PaymentStatusCell = ({ value }: { value: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "unpaid":
        return "bg-red-100 text-red-800 border-red-200"
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "waived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "under_review":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "under_review":
        return "Under Review"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <Badge className={`${getStatusStyles(value)} border`} variant="outline">
      {getStatusLabel(value)}
    </Badge>
  )
}

// Improved column definitions with proper headers
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
    accessorKey: "studentName",
    header: () => (
      <ColumnHeader icon={<User className="h-3.5 w-3.5" />} text="Student" />
    ),
    cell: ({ row }) => <RenterNameCell value={row.getValue("studentName")} />,
    size: 120,
  },
  {
    accessorKey: "violations",
    header: () => (
      <ColumnHeader
        icon={<AlertCircle className="h-3.5 w-3.5" />}
        text="Violation"
      />
    ),
    cell: ({ row }) => <ViolationCell value={row.getValue("violations")} />,
    size: 120,
  },
  {
    accessorKey: "dateOfInspection",
    header: () => (
      <ColumnHeader icon={<Calendar className="h-3.5 w-3.5" />} text="Date" />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("dateOfInspection")} />,
    sortingFn: "datetime",
    size: 100,
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
    size: 90,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ViolationActions violation={row.original} />,
    size: 50,
  },
]
