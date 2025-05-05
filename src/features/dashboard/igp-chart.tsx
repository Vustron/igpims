"use client"

import { Bar, XAxis, YAxis, BarChart, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"

export const IgpChart = () => {
  const data = [
    { name: "Item 1", value: 7 },
    { name: "Item 2", value: 12 },
    { name: "Item 3", value: 18 },
    { name: "Item 4", value: 25 },
  ]

  const chartConfig = {
    performance: {
      label: "Performance",
      color: "#76E4F7",
    },
  }

  return (
    <div className="w-auto rounded-lg border border-border bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-semibold text-lg">IGP Performance</h3>
      <div className="h-[300px] w-auto">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 30]}
              ticks={[0, 7, 15, 25]}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              name="performance"
              fill="var(--color-performance, #76E4F7)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
