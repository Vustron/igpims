"use client"

import { ProfitData } from "@/backend/actions/analytics/find-total-profit"
import { Card } from "@/components/ui/cards"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface SalesOverviewProps {
  analyticsData: ProfitData | undefined
}

export const SalesOverview = ({ analyticsData }: SalesOverviewProps) => {
  const data = [
    {
      name: "Locker Rentals",
      value: analyticsData?.data.totalLockerRevenue || 0,
      color: "#3182CE",
    },
    {
      name: "Water Vendo",
      value: analyticsData?.data.totalWaterRevenue || 0,
      color: "#4FD1C5",
    },
    {
      name: "Other IGPs",
      value: analyticsData?.data.totalIgpRevenue || 0,
      color: "#319795",
    },
  ]

  const chartConfig = {
    sales: {
      label: "Sales",
    },
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const formatCurrency = (value: number) => `₱${value.toLocaleString()}`

  return (
    <Card className="h-full w-full bg-background p-3 sm:p-4 md:p-6">
      <h3 className="mb-3 font-semibold text-sm sm:mb-4 sm:text-base md:mb-6 md:text-lg">
        Sales Breakdown
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center">
        {/* Pie Chart - Left side */}
        <div className="h-[180px] w-full sm:w-1/2 md:h-[220px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <ChartTooltipContent active={active} payload={payload} />
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Legend - Right side */}
        <div className="mt-4 w-full sm:mt-0 sm:w-1/2">
          <div className="flex flex-col space-y-3">
            {data.map((entry, index) => {
              const percentage = ((entry.value / total) * 100).toFixed(1)
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border border-border/50 p-2.5 sm:p-2"
                >
                  <div
                    className="h-4 w-4 rounded-full sm:h-3 sm:w-3"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="flex-grow text-xs sm:text-sm">
                    <div className="truncate font-medium">{entry.name}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-gray-500">{percentage}%</span>
                      <span className="font-semibold">
                        {formatCurrency(entry.value)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 border-border/50 border-t pt-2 font-medium text-sm">
            <div className="flex justify-between">
              <span>Total Sales:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
