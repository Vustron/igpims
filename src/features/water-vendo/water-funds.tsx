"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/selects"
import { ChevronDown, ChevronUp, Plus, Printer, Edit } from "lucide-react"
import { DataTable } from "@/components/ui/tables"
import { Button } from "@/components/ui/buttons"

import { useState, useMemo } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"

import type { ColumnDef } from "@tanstack/react-table"

const WaterVendoEntrySchema = z.object({
  id: z.string(),
  location: z.string(),
  gallonsUsed: z.number(),
  expenses: z.number(),
  revenue: z.number(),
  profit: z.number(),
  week: z.string(),
})

const WeekSummarySchema = z.object({
  id: z.string(),
  week: z.string(),
  totalRevenue: z.number(),
  totalExpenses: z.number(),
  totalProfit: z.number(),
  expanded: z.boolean().default(false),
})

type WaterVendoEntry = z.infer<typeof WaterVendoEntrySchema>
type WeekSummary = z.infer<typeof WeekSummarySchema>

const weekSummaries: WeekSummary[] = [
  {
    id: "week-3",
    week: "3rd WEEK OF APRIL 2025",
    totalRevenue: 756.0,
    totalExpenses: 456.0,
    totalProfit: 300.0,
    expanded: true,
  },
  {
    id: "week-2",
    week: "2nd WEEK OF APRIL 2025",
    totalRevenue: 756.0,
    totalExpenses: 456.0,
    totalProfit: 300.0,
    expanded: false,
  },
]

const waterVendoEntries: WaterVendoEntry[] = [
  {
    id: "entry-1",
    location: "LIBRARY",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd WEEK OF APRIL 2025",
  },
  {
    id: "entry-2",
    location: "ACADEMIC BUILDING",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd WEEK OF APRIL 2025",
  },
  {
    id: "entry-3",
    location: "MPEC",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd WEEK OF APRIL 2025",
  },
  {
    id: "entry-4",
    location: "NTED",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd WEEK OF APRIL 2025",
  },
  {
    id: "entry-5",
    location: "OLD ITED",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd WEEK OF APRIL 2025",
  },
  {
    id: "entry-6",
    location: "IADS",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "3rd WEEK OF APRIL 2025",
  },
  // Entries for week 2
  {
    id: "entry-7",
    location: "LIBRARY",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "2nd WEEK OF APRIL 2025",
  },
  {
    id: "entry-8",
    location: "ACADEMIC BUILDING",
    gallonsUsed: 3,
    expenses: 76.0,
    revenue: 126.0,
    profit: 50.0,
    week: "2nd WEEK OF APRIL 2025",
  },
]

export const WaterFunds = () => {
  const [weekData, setWeekData] = useState<WeekSummary[]>(weekSummaries)
  const [entries] = useState<WaterVendoEntry[]>(waterVendoEntries)

  const totalProfit = useMemo(() => {
    return weekData.reduce((sum, week) => sum + week.totalProfit, 0)
  }, [weekData])

  const toggleWeekExpanded = (weekId: string) => {
    setWeekData((prev) =>
      prev.map((week) =>
        week.id === weekId ? { ...week, expanded: !week.expanded } : week,
      ),
    )
  }

  const detailColumns: ColumnDef<WaterVendoEntry>[] = [
    {
      accessorKey: "location",
      header: "WATER VENDO",
      cell: ({ row }) => (
        <div className="font-medium text-xs">{row.getValue("location")}</div>
      ),
    },
    {
      accessorKey: "gallonsUsed",
      header: "GALLON USED",
      cell: ({ row }) => (
        <div className="text-center text-xs">{row.getValue("gallonsUsed")}</div>
      ),
    },
    {
      accessorKey: "expenses",
      header: "EXPENSES",
      cell: ({ row }) => (
        <div className="text-xs">
          ₱ {row.getValue<number>("expenses").toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "revenue",
      header: "REVENUE",
      cell: ({ row }) => (
        <div className="text-xs">
          ₱ {row.getValue<number>("revenue").toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "profit",
      header: "PROFIT",
      cell: ({ row }) => (
        <div className="font-medium text-xs">
          ₱ {row.getValue<number>("profit").toFixed(2)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "ACTION",
      cell: () => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-full">
                Action <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Sort by</span>
          <Select defaultValue="ALL">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              <SelectItem value="WEEK">Week</SelectItem>
              <SelectItem value="MONTH">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <div className="font-medium">
              Total Profit: ₱{totalProfit.toFixed(2)}
            </div>
            <div className="text-muted-foreground text-xs">
              As of April 21, 2025
            </div>
          </div>

          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>

          <Button variant="default" size="sm" className="flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            ADD FUND COLLECTION
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {weekData.map((week) => (
          <div key={week.id} className="overflow-hidden rounded-sm border">
            <div
              className="flex cursor-pointer justify-between bg-yellow-200 p-2"
              onClick={() => toggleWeekExpanded(week.id)}
            >
              <div className="font-medium text-sm">{week.week}</div>
              <div className="flex items-center space-x-8">
                <div className="text-sm">
                  <span className="font-medium">Total Revenue</span>
                  <span className="ml-2">₱{week.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Total Expenses</span>
                  <span className="ml-2">₱{week.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Total Profit</span>
                  <span className="ml-2">₱{week.totalProfit.toFixed(2)}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {week.expanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

            {week.expanded && (
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DataTable
                    columns={detailColumns}
                    data={entries.filter((entry) => entry.week === week.week)}
                    placeholder="Search water vendo entries..."
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Show</span>
          <Select defaultValue="7">
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="7">7</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">Entries</span>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-8 px-2">
            Prev
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-8 w-8 bg-yellow-600 p-0"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            3
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
