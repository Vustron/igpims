"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import { Card } from "@/components/ui/cards"

export const RevenueAnalytics = () => {
  const data = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 4890 },
    { name: "Jun", value: 6390 },
  ]

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#4FD1C5",
    },
  }

  return (
    <Card className="col-span-3 w-auto p-6">
      <h3 className="mb-4 font-semibold text-lg">Revenue Analytics</h3>
      <div className="h-[220px] ">
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              name="revenue"
              fill="var(--color-revenue, rgba(79, 209, 197, 0.2))"
              stroke="var(--color-revenue, #4FD1C5)"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
