"use client"

import { ProfitData } from "@/backend/actions/analytics/find-total-profit"
import { Card } from "@/components/ui/cards"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import { TrendingUp } from "lucide-react"
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
    <Card className="col-span-full h-full w-full bg-background p-4 md:p-6 lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base md:text-lg">
            Revenue Analytics
          </h3>
        </div>
        <div className="flex items-center rounded-md bg-primary/10 px-2 py-1 text-primary">
          <TrendingUp className="mr-1 h-4 w-4" />
          <span className="font-medium text-xs">
            {growthPercentage}% growth
          </span>
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
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
                <linearGradient id={colorIdRentals} x1="0" y1="0" x2="0" y2="1">
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
                strokeDasharray="3 3"
                opacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={yDomain}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null

                  const formattedPayload = payload.map((entry) => {
                    const name = entry.name
                    const value = entry.value

                    type ValidKeys =
                      | "lockerRentals"
                      | "waterVendo"
                      | "igpRevenue"
                    const labels: Record<ValidKeys, string> = {
                      lockerRentals: "Locker Rentals",
                      waterVendo: "Water Vendo",
                      igpRevenue: "Other IGPs",
                    }

                    const formattedName =
                      name && name in labels ? labels[name as ValidKeys] : name

                    return {
                      ...entry,
                      name: formattedName,
                      value: `₱${Number(value).toLocaleString()}`,
                    }
                  })

                  return (
                    <ChartTooltipContent
                      active={active}
                      payload={formattedPayload}
                    />
                  )
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => {
                  return (
                    <span style={{ fontSize: "11px", color: "#666" }}>
                      {value}
                    </span>
                  )
                }}
              />
              <ReferenceLine
                y={averageMonthlyRevenue}
                stroke="#CBD5E0"
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{
                  position: "right",
                  value: "Avg",
                  fill: "#718096",
                  fontSize: 10,
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
                  r: 5,
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
                  r: 5,
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
                  r: 5,
                  fill: "#2C7A7B",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}
