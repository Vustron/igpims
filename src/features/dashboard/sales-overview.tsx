"use client"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/cards"

export const SalesOverview = () => {
  const data = [
    { name: "Locker Rentals", value: 6500, color: "#3182CE" },
    { name: "Water Vendo", value: 4500, color: "#4FD1C5" },
    { name: "Merchandise", value: 5300, color: "#319795" },
  ]

  const chartConfig = {
    sales: {
      label: "Sales",
    },
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const formatCurrency = (value: number) => `₱${value.toLocaleString()}`

  return (
    <Card className="h-full w-full p-3 sm:p-4 md:p-6">
      <h3 className="mb-2 font-semibold text-sm sm:mb-4 sm:text-base md:mb-6 md:text-lg">
        Sales Overview
      </h3>

      <div className="h-[180px] w-full sm:h-[200px] md:h-[240px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="50%"
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:mt-3 sm:grid-cols-3 sm:gap-3 md:mt-4 md:gap-4">
        {data.map((entry, index) => {
          const percentage = ((entry.value / total) * 100).toFixed(1)
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md border border-border/50 p-2 sm:border-0 sm:p-0"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <div className="text-xs">
                <div className="truncate font-medium">{entry.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{percentage}%</span>
                  <span className="ml-1 font-semibold">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
