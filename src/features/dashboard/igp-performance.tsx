"use client"

import { ProfitData } from "@/backend/actions/analytics/find-total-profit"
import { Card } from "@/components/ui/cards"
import { ChartContainer } from "@/components/ui/charts"
import { BarChart3, TrendingUp } from "lucide-react"
import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Text,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const CustomXAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <Text
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        fill="currentColor"
        fontSize={11}
        width={150}
        className="fill-slate-600 dark:fill-slate-400"
      >
        {payload.value}
      </Text>
    </g>
  )
}

interface IgpPerformanceProps {
  profitData: ProfitData | undefined
}

export const IgpPerformance = ({ profitData }: IgpPerformanceProps) => {
  const chartData = useMemo(() => {
    if (!profitData?.igpRevenues) return []

    return profitData.igpRevenues
      .filter((igp) => igp.revenue >= 0)
      .map((igp) => ({
        name: igp.name,
        value: igp.revenue,
      }))
  }, [profitData])

  const { yAxisDomain, yAxisTicks } = useMemo(() => {
    const maxValue = Math.max(1000, ...chartData.map((item) => item.value))
    const upperLimit = Math.ceil(maxValue / 200) * 200

    let tickSpacing: any
    if (upperLimit <= 200) tickSpacing = 20
    else if (upperLimit <= 500) tickSpacing = 50
    else if (upperLimit <= 1000) tickSpacing = 100
    else if (upperLimit <= 5000) tickSpacing = 200
    else if (upperLimit <= 10000) tickSpacing = 1000
    else tickSpacing = 2000

    const ticks = []
    for (let i = 0; i <= upperLimit; i += tickSpacing) {
      ticks.push(i)
    }

    if (!ticks.includes(upperLimit)) {
      ticks.push(upperLimit)
    }

    return {
      yAxisDomain: [0, upperLimit],
      yAxisTicks: ticks,
    }
  }, [chartData])

  const getBarColors = useMemo(() => {
    const baseColor = "#3B82F6"
    const highlightColor = "#06B6D4"

    if (chartData.every((item) => item.value === 0)) {
      return chartData.map(() => baseColor)
    }

    return chartData.map((_, index) => {
      const maxValueIndex = chartData.findIndex(
        (item) => item.value === Math.max(...chartData.map((d) => d.value)),
      )
      return index === maxValueIndex ? highlightColor : baseColor
    })
  }, [chartData])

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  const topPerformer = useMemo(() => {
    if (chartData.length === 0) return null
    return chartData.reduce((max, item) =>
      item.value > max.value ? item : max,
    )
  }, [chartData])

  const chartConfig = {
    performance: {
      label: "Revenue",
      color: "#3B82F6",
    },
  }

  return (
    <Card className="group relative col-span-full h-full w-full overflow-hidden border border-slate-200 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm">
      <div className="relative z-10 p-4 md:p-6 h-full flex flex-col">
        {/* Header Section */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                IGP Income Performance
              </h3>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Revenue
              </p>
              <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ₱{totalRevenue.toLocaleString()}
              </p>
            </div>
            {topPerformer && (
              <div className="text-right">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Top Performer
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {topPerformer.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Container - Made flexible to fill remaining space */}
        <div className="relative flex-1 min-h-0">
          {/* Holographic corner accents */}
          <div className="absolute top-0 left-0 h-px w-12 bg-gradient-to-r from-blue-400 to-transparent" />
          <div className="absolute top-0 left-0 h-12 w-px bg-gradient-to-b from-blue-400 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-12 bg-gradient-to-l from-cyan-400 to-transparent" />
          <div className="absolute bottom-0 right-0 h-12 w-px bg-gradient-to-t from-cyan-400 to-transparent" />

          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 50,
                  right: 20,
                  left: 20,
                  bottom: 0,
                }}
                barSize={80}
                barGap={12}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="highlightGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0891B2" stopOpacity={0.8} />
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
                  dataKey="name"
                  tick={<CustomXAxisTick />}
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 20, right: 20 }}
                  height={50}
                  interval={0}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "currentColor",
                    className: "fill-slate-600 dark:fill-slate-400",
                  }}
                  axisLine={false}
                  tickLine={false}
                  domain={yAxisDomain}
                  ticks={yAxisTicks}
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(59, 130, 246, 0.1)",
                    stroke: "rgba(59, 130, 246, 0.3)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
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
                        <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          ₱{Number(payload[0]?.value).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Sales Income
                        </p>
                      </div>
                    )
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Sales Income"
                  radius={[6, 6, 0, 0]}
                  className="drop-shadow-sm"
                >
                  {chartData.map((_, index) => {
                    const isHighlight = getBarColors[index] === "#06B6D4"
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          isHighlight
                            ? "url(#highlightGradient)"
                            : "url(#barGradient)"
                        }
                        style={{
                          filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                        }}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
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
            </div>
            <div className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {chartData.length} IGP Categories
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
