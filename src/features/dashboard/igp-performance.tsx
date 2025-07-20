"use client"

import { ProfitData } from "@/backend/actions/analytics/find-total-profit"
import { Card } from "@/components/ui/cards"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
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
        fill="#666"
        fontSize={12}
        width={200}
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
    const baseColor = "#76E4F7"
    const highlightColor = "#0BC5EA"

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

  const chartConfig = {
    performance: {
      label: "Revenue",
      color: "#76E4F7",
    },
  }

  return (
    <Card className="col-span-full h-full w-full bg-background p-5">
      <h3 className="mb-6 font-semibold text-lg">IGP Income Performance</h3>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 30,
            }}
            barSize={100}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.15}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              padding={{ left: 20, right: 20 }}
              height={40}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={yAxisDomain}
              ticks={yAxisTicks}
              tickFormatter={(value) => `₱${value.toLocaleString()}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(118, 228, 247, 0.1)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null

                const formattedPayload = payload.map((entry) => ({
                  ...entry,
                  value: `₱${Number(entry.value).toLocaleString()}`,
                  name: "Sales Income",
                }))

                return (
                  <ChartTooltipContent
                    active={active}
                    payload={formattedPayload}
                  />
                )
              }}
            />
            <Bar dataKey="value" name="Sales Income" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColors[index]}
                  filter="drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
