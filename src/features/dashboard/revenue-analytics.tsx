"use client"

import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import { Card } from "@/components/ui/cards"

export const RevenueAnalytics = () => {
  const data = [
    { month: "Jan", revenue: 2500 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 2800 },
    { month: "Apr", revenue: 5400 },
    { month: "May", revenue: 4300 },
    { month: "Jun", revenue: 5200 },
  ]

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3182CE",
    },
  }

  return (
    <Card className="col-span-full h-full w-full p-3 sm:p-4 md:p-6 lg:col-span-3">
      <h3 className="mb-2 font-semibold text-sm sm:mb-4 sm:text-base md:mb-6 md:text-lg">
        Revenue Analytics
      </h3>
      <div className="h-[200px] w-full sm:h-[250px] md:h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `₱${value}`}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="revenue"
                fill="#3182CE"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}
