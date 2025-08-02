"use client"

import { ProfitData } from "@/backend/actions/analytics/find-total-profit"
import { Card } from "@/components/ui/cards"
import { ChartContainer } from "@/components/ui/charts"
import { PieChart, TrendingUp } from "lucide-react"
import { useId, useMemo } from "react"
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface SalesOverviewProps {
  analyticsData: ProfitData | undefined
}

export const SalesOverview = ({ analyticsData }: SalesOverviewProps) => {
  const gradientId = useId() // Added gradient ID for unique gradients

  const data = useMemo(
    () => [
      {
        name: "Locker Rentals",
        value: analyticsData?.data.totalLockerRevenue || 0,
        color: "#3182CE",
        gradient: "from-blue-500 to-blue-600",
      },
      {
        name: "Water Vendo",
        value: analyticsData?.data.totalWaterRevenue || 0,
        color: "#38B2AC",
        gradient: "from-teal-500 to-teal-600",
      },
      {
        name: "Other IGPs",
        value: analyticsData?.data.totalIgpRevenue || 0,
        color: "#2C7A7B",
        gradient: "from-cyan-500 to-cyan-600",
      },
    ],
    [analyticsData],
  )

  const chartConfig = {
    sales: {
      label: "Sales",
    },
  }

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data],
  )
  const formatCurrency = (value: number) => `₱${value.toLocaleString()}`

  const topCategory = useMemo(() => {
    return data.reduce((max, item) => (item.value > max.value ? item : max))
  }, [data])

  return (
    <Card className="group relative h-full w-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm">
      <div className="relative z-10 p-3 sm:p-4 md:p-6 h-full flex flex-col">
        {/* Header Section - Updated with modern styling */}
        <div className="mb-3 sm:mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
              <PieChart className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base md:text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Sales Breakdown
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  REVENUE SPLIT
                </span>
              </div>
            </div>
          </div>

          {/* Top Category indicator - Added */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400">
            <TrendingUp className="h-3 w-3" />
            <span>{topCategory.name}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-h-0">
          {/* Pie Chart - Left side with holographic effects */}
          <div className="relative h-[180px] w-full sm:w-1/2 md:h-[220px]">
            {/* Holographic corner accents - Added */}
            <div className="absolute top-0 left-0 h-px w-8 bg-gradient-to-r from-blue-400 to-transparent" />
            <div className="absolute top-0 left-0 h-8 w-px bg-gradient-to-b from-blue-400 to-transparent" />
            <div className="absolute bottom-0 right-0 h-px w-8 bg-gradient-to-l from-cyan-400 to-transparent" />
            <div className="absolute bottom-0 right-0 h-8 w-px bg-gradient-to-t from-cyan-400 to-transparent" />

            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <defs>
                    {/* Added gradient definitions for each segment */}
                    <linearGradient
                      id={`gradient-locker-${gradientId}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3182CE" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#2563EB"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                    <linearGradient
                      id={`gradient-water-${gradientId}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#38B2AC" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#0891B2"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                    <linearGradient
                      id={`gradient-igp-${gradientId}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#2C7A7B" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#0E7490"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="70%"
                    innerRadius="30%"
                    fill="#8884d8"
                    dataKey="value"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                  >
                    {data.map((_entry, index) => {
                      const gradientIds = [
                        `gradient-locker-${gradientId}`,
                        `gradient-water-${gradientId}`,
                        `gradient-igp-${gradientId}`,
                      ]
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#${gradientIds[index]})`}
                          style={{
                            filter:
                              "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                          }}
                        />
                      )
                    })}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null

                      const data = payload[0]?.payload
                      const percentage = ((data.value / total) * 100).toFixed(1)

                      return (
                        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                              {data.name}
                            </p>
                          </div>
                          <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {formatCurrency(data.value)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {percentage}% of total
                          </p>
                        </div>
                      )
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Center total display  */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total
                </p>
                <p className="text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>

            {/* Scan line animation - Added */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse opacity-30" />
            </div>
          </div>

          {/* Legend - Right side with modern styling */}
          <div className="mt-4 w-full sm:mt-0 sm:w-1/2 flex-1">
            <div className="flex flex-col space-y-3">
              {data.map((entry, index) => {
                const percentage = ((entry.value / total) * 100).toFixed(1)
                const isTop = entry.value === topCategory.value // Added top category highlighting

                return (
                  <div
                    key={index}
                    className={`group/item relative overflow-hidden rounded-lg p-2.5 sm:p-2 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 ${
                      isTop
                        ? "border border-green-500/30 bg-green-500/5"
                        : "border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50"
                    }`}
                  >
                    {/* Background gradient effect - Added */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${entry.gradient} opacity-20`}
                      />
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full sm:h-3 sm:w-3 shadow-sm" // Added shadow
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="flex-grow text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                            {entry.name}
                          </span>
                          {isTop && (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          )}{" "}
                          {/* Added top indicator */}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 font-mono">
                            {percentage}%
                          </span>
                          <span className="font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            {formatCurrency(entry.value)}
                          </span>
                        </div>

                        {/* Progress bar - Added */}
                        <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${entry.gradient} rounded-full transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Item scan line - Added */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute -top-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer total with modern styling - Updated */}
            <div className="mt-3 border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300">
                    Total Sales:
                  </span>
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
