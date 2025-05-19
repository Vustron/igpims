"use client"

import {
  weekSummaries,
  waterVendoEntries,
  waterVendoEntryColumn,
} from "@/features/water-vendo/water-vendo-entry-column"
import { WaterFundsSummaryCards } from "@/features/water-vendo/water-funds-summary-card"
import { WaterFundsControls } from "@/features/water-vendo/water-funds-control"
import { Calendar, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { Separator } from "@/components/ui/separators"
import { DataTable } from "@/components/ui/tables"
import { Button } from "@/components/ui/buttons"

import { useState, useMemo } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"

export const WaterVendoEntrySchema = z.object({
  id: z.string(),
  location: z.string(),
  gallonsUsed: z.number(),
  expenses: z.number(),
  revenue: z.number(),
  profit: z.number(),
  week: z.string(),
  date: z.date().optional(),
})

export const WeekSummarySchema = z.object({
  id: z.string(),
  week: z.string(),
  totalRevenue: z.number(),
  totalExpenses: z.number(),
  totalProfit: z.number(),
  expanded: z.boolean().default(false),
  dateRange: z.string().optional(),
})

export type WaterVendoEntry = z.infer<typeof WaterVendoEntrySchema>
export type WeekSummary = z.infer<typeof WeekSummarySchema>

export const WaterFunds = () => {
  const [weekData, setWeekData] = useState<WeekSummary[]>(weekSummaries)
  const [entries] = useState<WaterVendoEntry[]>(waterVendoEntries)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [compareWithPrevious] = useState(false)
  const [timeRange, setTimeRange] = useState("ALL")

  const totalProfit = useMemo(() => {
    return weekData.reduce((sum, week) => sum + week.totalProfit, 0)
  }, [weekData])

  const totalRevenue = useMemo(() => {
    return weekData.reduce((sum, week) => sum + week.totalRevenue, 0)
  }, [weekData])

  const totalExpenses = useMemo(() => {
    return weekData.reduce((sum, week) => sum + week.totalExpenses, 0)
  }, [weekData])

  const toggleWeekExpanded = (weekId: string) => {
    setWeekData((prev) =>
      prev.map((week) =>
        week.id === weekId ? { ...week, expanded: !week.expanded } : week,
      ),
    )
  }

  const handlePrint = () => {
    console.log("Printing report...")
    window.print()
  }

  const handleAddCollection = () => {
    console.log("Adding new collection...")
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      {/* Summary cards */}
      <WaterFundsSummaryCards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        totalProfit={totalProfit}
        asOfDate="April 21, 2025"
        compareWithPrevious={compareWithPrevious}
      />

      {/* Controls */}
      <WaterFundsControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onPrint={handlePrint}
        onAddCollection={handleAddCollection}
      />

      <Separator className="my-6" />

      {/* Collapsible sections */}
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {weekData.map((week) => (
          <motion.div
            key={week.id}
            variants={itemVariants}
            layout
            className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="flex cursor-pointer items-center justify-between bg-gradient-to-r from-yellow-50 to-yellow-100/50 p-4"
              onClick={() => toggleWeekExpanded(week.id)}
            >
              <div>
                <span className="font-medium text-sm">{week.week}</span>
                <div className="flex items-center text-muted-foreground text-xs">
                  <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {week.dateRange}
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden md:block">
                  <div className="flex flex-col text-right">
                    <span className="text-muted-foreground text-xs">
                      Revenue
                    </span>
                    <span className="font-medium text-sm">
                      ₱
                      {week.totalRevenue.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="flex flex-col text-right">
                    <span className="text-muted-foreground text-xs">
                      Expenses
                    </span>
                    <span className="font-medium text-sm">
                      ₱
                      {week.totalExpenses.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col text-right">
                    <span className="text-muted-foreground text-xs">
                      Profit
                    </span>
                    <span className="font-medium text-green-600 text-sm">
                      ₱
                      {week.totalProfit.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <div className="flex h-8 w-8 items-center justify-center">
                    {week.expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {week.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="overflow-hidden p-5 print:overflow-visible">
                    <DataTable
                      columns={waterVendoEntryColumn}
                      data={entries.filter(
                        (entry) =>
                          entry.week === week.week &&
                          (searchTerm === "" ||
                            entry.location
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())),
                      )}
                      placeholder="No entries found"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
