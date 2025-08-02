"use client"

import { ProfitData } from "@/backend/actions/analytics/find-total-profit"
import { Card } from "@/components/ui/cards"
import { ChartContainer } from "@/components/ui/charts"
import { Activity, TrendingUp } from "lucide-react"
import { useId, useMemo } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface RevenueAnalyticsProps {
  analyticsData: ProfitData | undefined
}

export const RevenueAnalytics = ({ analyticsData }: RevenueAnalyticsProps) => {
  const colorIdRentals = useId()
  const colorIdWaterVendo = useId()
  const colorIdIgp = useId()

  const data = useMemo(() => {
    if (!analyticsData?.monthlyRevenue) return []

    const currentDate = new Date()
    return analyticsData.monthlyRevenue.slice(0, currentDate.getMonth() + 1)
  }, [analyticsData?.monthlyRevenue])

  const totalRevenue = useMemo(() => {
    return data.reduce((acc, item) => {
      return acc + item.lockerRentals + item.waterVendo + item.igpRevenue
    }, 0)
  }, [data])

  const averageMonthlyRevenue = useMemo(() => {
    return data.length > 0 ? Math.round(totalRevenue / data.length) : 0
  }, [totalRevenue, data.length])

  const growthPercentage = useMemo(() => {
    if (data.length < 2) return 0

    const firstMonth = data[0]
    const lastMonth = data[data.length - 1]

    const firstTotal =
      (firstMonth?.lockerRentals || 0) +
      (firstMonth?.waterVendo || 0) +
      (firstMonth?.igpRevenue || 0)
    const lastTotal =
      (lastMonth?.lockerRentals || 0) +
      (lastMonth?.waterVendo || 0) +
      (lastMonth?.igpRevenue || 0)

    return firstTotal === 0
      ? 0
      : Math.round(((lastTotal - firstTotal) / firstTotal) * 100)
  }, [data])

  const yDomain = useMemo(() => {
    const maxValues = data.map((item) =>
      Math.max(item.lockerRentals, item.waterVendo, item.igpRevenue),
    )
    const max = Math.max(...maxValues)
    const min = 0
    const padding = max * 0.1
    return [min, Math.ceil((max + padding) / 1000) * 1000]
  }, [data])

  const chartConfig = {
    lockerRentals: {
      label: "Locker Rentals",
      color: "#3182CE",
    },
    waterVendo: {
      label: "Water Vendo",
      color: "#38B2AC",
    },
    igpRevenue: {
      label: "Other IGPs",
      color: "#2C7A7B",
    },
  }

  return (
    <Card className="group relative col-span-full h-full w-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm lg:col-span-3">
      <div className="relative z-10 p-4 md:p-6 h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Revenue Analytics
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  MONTHLY TRENDS
                </span>
              </div>
            </div>
          </div>

          {/* Growth indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border ${
              growthPercentage >= 0
                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            <span>{growthPercentage}% growth</span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative flex-1 min-h-0">
          {/* Holographic corner accents */}
          <div className="absolute top-0 left-0 h-px w-12 bg-gradient-to-r from-blue-400 to-transparent" />
          <div className="absolute top-0 left-0 h-12 w-px bg-gradient-to-b from-blue-400 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-12 bg-gradient-to-l from-cyan-400 to-transparent" />
          <div className="absolute bottom-0 right-0 h-12 w-px bg-gradient-to-t from-cyan-400 to-transparent" />

          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 15,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient
                    id={colorIdRentals}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3182CE" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id={colorIdWaterVendo}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#38B2AC" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38B2AC" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id={colorIdIgp} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C7A7B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2C7A7B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="2 4"
                  opacity={0.2}
                  vertical={false}
                  stroke="currentColor"
                  className="stroke-slate-300 dark:stroke-slate-600"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fill: "currentColor",
                    className: "fill-slate-600 dark:fill-slate-400",
                  }}
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                />

                <YAxis
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                  tick={{
                    fontSize: 10,
                    fill: "currentColor",
                    className: "fill-slate-600 dark:fill-slate-400",
                  }}
                  axisLine={false}
                  tickLine={false}
                  domain={yDomain}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null

                    return (
                      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                          <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                            {label}
                          </p>
                        </div>
                        <div className="space-y-1">
                          {payload.map((entry, index) => {
                            const labels = {
                              lockerRentals: "Locker Rentals",
                              waterVendo: "Water Vendo",
                              igpRevenue: "Other IGPs",
                            }
                            const name = entry.name as keyof typeof labels
                            const formattedName = labels[name] || entry.name

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-xs text-slate-600 dark:text-slate-400">
                                    {formattedName}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  ₱{Number(entry.value).toLocaleString()}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }}
                />

                <Legend
                  verticalAlign="top"
                  height={32}
                  iconType="circle"
                  iconSize={6}
                  formatter={(value) => {
                    const labels = {
                      "Locker Rentals": "Locker Rentals",
                      "Water Vendo": "Water Vendo",
                      "Other IGPs": "Other IGPs",
                    }
                    return (
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {labels[value as keyof typeof labels] || value}
                      </span>
                    )
                  }}
                />

                <ReferenceLine
                  y={averageMonthlyRevenue}
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  className="stroke-slate-400 dark:stroke-slate-500"
                  label={{
                    position: "right",
                    value: "Avg",
                    fill: "currentColor",
                    fontSize: 9,
                    className: "fill-slate-500 dark:fill-slate-400",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="lockerRentals"
                  stroke="#3182CE"
                  strokeWidth={2}
                  fill={`url(#${colorIdRentals})`}
                  fillOpacity={0.3}
                  name="lockerRentals"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#3182CE",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={true}
                />

                <Area
                  type="monotone"
                  dataKey="waterVendo"
                  stroke="#38B2AC"
                  strokeWidth={2}
                  fill={`url(#${colorIdWaterVendo})`}
                  fillOpacity={0.3}
                  name="waterVendo"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#38B2AC",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={true}
                />

                <Area
                  type="monotone"
                  dataKey="igpRevenue"
                  stroke="#2C7A7B"
                  strokeWidth={2}
                  fill={`url(#${colorIdIgp})`}
                  fillOpacity={0.3}
                  name="igpRevenue"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#2C7A7B",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={true}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Scan line animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse opacity-30" />
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                LIVE
              </span>
            </div>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Avg: ₱{averageMonthlyRevenue.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  )
}
