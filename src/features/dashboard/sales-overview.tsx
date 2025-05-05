"use client"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
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

  return (
    <Card className="col-span-2 p-6">
      <h3 className="mb-4 font-semibold text-lg">Sales Overview</h3>
      <div className="h-[200px]">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </div>
      <div className="mt-2 flex justify-center gap-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.name}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
