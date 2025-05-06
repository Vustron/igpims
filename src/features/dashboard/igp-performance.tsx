"use client"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/cards"

export const IgpPerformance = () => {
  const data = [
    { name: "Week 1", value: 7 },
    { name: "Week 2", value: 12 },
    { name: "Week 3", value: 18 },
    { name: "Week 4", value: 25 },
  ]

  const chartConfig = {
    performance: {
      label: "Performance",
      color: "#76E4F7",
    },
  }

  return (
    <Card className="col-span-full h-full w-full p-3 sm:p-4 md:p-6 lg:col-span-2">
      <h3 className="mb-2 font-semibold text-sm sm:mb-4 sm:text-base md:mb-6 md:text-lg">
        IGP Performance
      </h3>
      <div className="h-[180px] w-full sm:h-[200px] md:h-[240px]">
        <ChartContainer config={chartConfig} className="mt-15 h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 0,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="colorPerformance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#76E4F7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#76E4F7" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#76E4F7"
                fillOpacity={1}
                fill="url(#colorPerformance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}
