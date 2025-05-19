"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdowns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import {
  Edit,
  Trash2,
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  BarChart2,
  Copy,
  Droplet,
  DollarSign,
  TrendingUp,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"
import { cn } from "@/utils/cn"

import { format } from "date-fns"
import { motion } from "framer-motion"

import type {
  WeekSummary,
  WaterVendoEntry,
} from "@/features/water-vendo/water-funds"
import type { ColumnDef } from "@tanstack/react-table"

// Mock data for week summaries
export const weekSummaries: WeekSummary[] = [
  {
    id: "week-3",
    week: "3rd Week of April 2025",
    totalRevenue: 756.0,
    totalExpenses: 456.0,
    totalProfit: 300.0,
    expanded: true,
    dateRange: "April 15 - 21, 2025",
  },
  {
    id: "week-2",
    week: "2nd Week of April 2025",
    totalRevenue: 756.0,
    totalExpenses: 456.0,
    totalProfit: 300.0,
    expanded: false,
    dateRange: "April 8 - 14, 2025",
  },
  {
    id: "week-1",
    week: "1st Week of April 2025",
    totalRevenue: 820.0,
    totalExpenses: 480.0,
    totalProfit: 340.0,
    expanded: false,
    dateRange: "April 1 - 7, 2025",
  },
  {
    id: "week-0",
    week: "Last Week of March 2025",
    totalRevenue: 680.0,
    totalExpenses: 420.0,
    totalProfit: 260.0,
    expanded: false,
    dateRange: "March 24 - 31, 2025",
  },
]

// Enhanced mock data for water vendo entries with more variations
export const waterVendoEntries: WaterVendoEntry[] = [
  {
    id: "entry-1",
    location: "Library",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd Week of April 2025",
    date: new Date(2025, 3, 15),
  },
  {
    id: "entry-2",
    location: "Academic Building",
    gallonsUsed: 5,
    expenses: 125.0,
    revenue: 215.0,
    profit: 90.0,
    week: "3rd Week of April 2025",
    date: new Date(2025, 3, 16),
  },
  {
    id: "entry-3",
    location: "MPEC",
    gallonsUsed: 2,
    expenses: 52.0,
    revenue: 88.0,
    profit: 36.0,
    week: "3rd Week of April 2025",
    date: new Date(2025, 3, 17),
  },
  {
    id: "entry-4",
    location: "NTED",
    gallonsUsed: 4,
    expenses: 98.0,
    revenue: 168.0,
    profit: 70.0,
    week: "3rd Week of April 2025",
    date: new Date(2025, 3, 18),
  },
  {
    id: "entry-5",
    location: "Old ITED",
    gallonsUsed: 1,
    expenses: 28.0,
    revenue: 42.0,
    profit: 14.0,
    week: "3rd Week of April 2025",
    date: new Date(2025, 3, 19),
  },
  {
    id: "entry-6",
    location: "IADS",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd Week of April 2025",
    date: new Date(2025, 3, 20),
  },
  // Entries for week 2
  {
    id: "entry-7",
    location: "Library",
    gallonsUsed: 4,
    expenses: 98.0,
    revenue: 168.0,
    profit: 70.0,
    week: "2nd Week of April 2025",
    date: new Date(2025, 3, 8),
  },
  {
    id: "entry-8",
    location: "Academic Building",
    gallonsUsed: 6,
    expenses: 148.0,
    revenue: 252.0,
    profit: 104.0,
    week: "2nd Week of April 2025",
    date: new Date(2025, 3, 9),
  },
  // Entries for week 1
  {
    id: "entry-9",
    location: "MPEC",
    gallonsUsed: 5,
    expenses: 125.0,
    revenue: 210.0,
    profit: 85.0,
    week: "1st Week of April 2025",
    date: new Date(2025, 3, 3),
  },
  {
    id: "entry-10",
    location: "NTED",
    gallonsUsed: 8,
    expenses: 190.0,
    revenue: 320.0,
    profit: 130.0,
    week: "1st Week of April 2025",
    date: new Date(2025, 3, 5),
  },
  // March entry with negative profit
  {
    id: "entry-11",
    location: "Old ITED",
    gallonsUsed: 2,
    expenses: 98.0,
    revenue: 84.0,
    profit: -14.0,
    week: "Last Week of March 2025",
    date: new Date(2025, 2, 28),
  },
]

// Enhanced calendar with animation
const AnimatedCalendar = ({ date }: { date: Date }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center text-xs">
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="mr-2">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
            </motion.div>
            {format(date, "MMM d, yyyy")}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{format(date, "EEEE, MMMM d, yyyy")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Enhanced badge with animation for gallons
const AnimatedGallonsBadge = ({ value }: { value: number }) => {
  // Maps gallons to visual indicators
  const getGallonsIndicator = (val: number) => {
    if (val >= 6)
      return {
        color: "bg-blue-500/20 text-blue-700 border-blue-200",
        label: "High",
      }
    if (val >= 3)
      return {
        color: "bg-emerald-500/20 text-emerald-700 border-emerald-200",
        label: "Medium",
      }
    return {
      color: "bg-amber-500/20 text-amber-700 border-amber-200",
      label: "Low",
    }
  }

  const indicator = getGallonsIndicator(value)

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="inline-flex">
      <Badge
        variant="outline"
        className={cn(
          "flex items-center gap-1 px-2 py-0.5 font-medium text-xs",
          indicator.color,
        )}
      >
        <Droplet className="h-3 w-3" />
        {value} gal
        <span className="ml-1 rounded-sm bg-white/50 px-1 py-0.5 text-[10px]">
          {indicator.label}
        </span>
      </Badge>
    </motion.div>
  )
}

// Financial value display component
const FinancialValue = ({
  value,
  type,
}: {
  value: number
  type: "revenue" | "expenses" | "profit"
}) => {
  // Configure colors and icons based on type
  const config = {
    revenue: {
      icon: TrendingUp,
      color: "text-blue-600",
      bgHover: "group-hover:bg-blue-50",
      tooltip: "Revenue generated",
    },
    expenses: {
      icon: DollarSign,
      color: "text-red-600",
      bgHover: "group-hover:bg-red-50",
      tooltip: "Expenses incurred",
    },
    profit: {
      icon: BarChart2,
      color: value >= 0 ? "text-emerald-600" : "text-red-600",
      bgHover:
        value >= 0 ? "group-hover:bg-emerald-50" : "group-hover:bg-red-50",
      tooltip: value >= 0 ? "Profit earned" : "Loss incurred",
    },
  }

  const { icon: Icon, color, bgHover, tooltip } = config[type]
  const formattedValue = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`font-medium text-xs ${color} group rounded-md px-2 py-1 transition-colors ${bgHover}`}
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-1.5">
              <Icon className="h-3 w-3" />
              <span>{formattedValue}</span>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">
            {tooltip}: {formattedValue}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Enhanced table columns with improvements for mobile responsiveness and visual appeal
export const waterVendoEntryColumn: ColumnDef<WaterVendoEntry>[] = [
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0 font-medium text-xs"
          >
            <span className="hidden sm:inline">Water Vendo</span>
            <span className="inline sm:hidden">Location</span>
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center font-medium text-xs">
        <MapPin className="mr-1.5 h-3 w-3 text-slate-400" />
        {row.getValue("location")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium text-xs"
      >
        Date
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.date
      return date ? <AnimatedCalendar date={date} /> : null
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "gallonsUsed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap font-medium text-xs"
      >
        <span className="hidden sm:inline">Gallons Used</span>
        <span className="inline sm:hidden">Gallons</span>
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <AnimatedGallonsBadge value={row.getValue("gallonsUsed")} />
    ),
    enableHiding: true,
  },
  {
    accessorKey: "expenses",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <span>Expenses</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <FinancialValue
        value={row.getValue<number>("expenses")}
        type="expenses"
      />
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <span>Revenue</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <FinancialValue value={row.getValue<number>("revenue")} type="revenue" />
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-xs"
        >
          <span>Profit</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <FinancialValue value={row.getValue<number>("profit")} type="profit" />
    ),
    enableHiding: false,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const entry = row.original

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-slate-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => console.log("Copy ID", entry.id)}
                className="text-xs"
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy Entry ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("View details", entry)}
                className="text-xs"
              >
                <BarChart2 className="mr-2 h-3.5 w-3.5" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => console.log("Edit", entry)}
                className="text-xs"
              >
                <Edit className="mr-2 h-3.5 w-3.5" />
                Edit Entry
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Delete", entry)}
                className="text-red-600 text-xs"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enableHiding: false,
  },
]

// Helper function to generate cell classes based on meta info
export const getCellClassNames = (columnMeta?: Record<string, any>): string => {
  return cn(
    "p-3 align-middle [&:has([role=checkbox])]:pr-0",
    columnMeta?.className,
  )
}
