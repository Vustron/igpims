"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/buttons"
import { Card, CardContent } from "@/components/ui/cards"
import { DataTable } from "@/components/ui/tables"
import {
  waterVendoEntries,
  waterVendoEntryColumn,
  weekSummaries,
} from "../vendo/water-vendo-entry-column"

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
  const [searchTerm] = useState("")

  const toggleWeekExpanded = (weekId: string) => {
    setWeekData((prev) =>
      prev.map((week) =>
        week.id === weekId ? { ...week, expanded: !week.expanded } : week,
      ),
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {weekData.map((week) => (
          <motion.div
            key={week.id}
            variants={itemVariants}
            layout
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          >
            <Button
              variant="ghost"
              className="w-full cursor-pointer justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 transition-all duration-200 hover:from-slate-100 hover:to-slate-100 sm:p-6"
              onClick={() => toggleWeekExpanded(week.id)}
            >
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 text-xs">
                    {week.week}
                  </span>
                </div>
                <div className="-mt-2 flex items-center text-muted-foreground text-xs">
                  <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{week.dateRange}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 sm:hidden">
                <div className="text-right">
                  <span className="text-xs">
                    {formatCurrency(week.totalProfit)}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs">Net Profit</div>
                <div className="flex items-center rounded-full bg-gray-100 p-1">
                  {week.expanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="hidden items-center gap-6 sm:flex lg:gap-8">
                <div className="text-right">
                  <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Revenue
                  </div>
                  <div className="font-bold text-xs">
                    {formatCurrency(week.totalRevenue)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Expenses
                  </div>
                  <div className="font-bold text-xs">
                    {formatCurrency(week.totalExpenses)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Net Profit
                  </div>
                  <div className="font-bold text-xs">
                    {formatCurrency(week.totalProfit)}
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
                  {week.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </div>
            </Button>

            <AnimatePresence>
              {week.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 sm:hidden">
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-3 text-center">
                          <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                            Revenue
                          </div>
                          <div className="font-bold text-blue-600 text-sm">
                            {formatCurrency(week.totalRevenue)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-3 text-center">
                          <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                            Expenses
                          </div>
                          <div className="font-bold text-red-600 text-sm">
                            {formatCurrency(week.totalExpenses)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="bg-gray-50/30 p-4 sm:p-6 print:overflow-visible print:bg-white">
                    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                      <div className="p-10">
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
                          placeholder=""
                        />
                      </div>
                    </div>
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
