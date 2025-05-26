import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"

import { chartConfig } from "@/features/report/sales-report-types"
import { motion } from "framer-motion"

import type {
  IgpType,
  TimeRange,
  IgpSummary,
  MonthlySales,
} from "@/features/report/sales-report-types"

interface SalesOverviewTabProps {
  chartType: "bar" | "line" | "pie" | "area"
  chartData: MonthlySales[]
  pieChartData: { name: string; value: number; color: string }[]
  igpSummaries: IgpSummary[]
  topSellingItems: { itemName: string; quantity: number; totalAmount: number }[]
  timeRange: TimeRange
  formatCurrency: (amount: number) => string
}

export const SalesOverviewTab = ({
  chartType,
  chartData,
  pieChartData,
  igpSummaries,
  topSellingItems,
  timeRange,
  formatCurrency,
}: SalesOverviewTabProps) => {
  return (
    <>
      {/* Main charts section */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>
            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Sales
            Performance
          </CardTitle>
          <CardDescription>
            Breakdown of sales performance across different IGPs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value) =>
                        `₱${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="lockerRental"
                      name="Locker Rental"
                      fill="#3182CE"
                    />
                    <Bar
                      dataKey="waterVendo"
                      name="Water Vendo"
                      fill="#38B2AC"
                    />
                    <Bar
                      dataKey="merchandise"
                      name="Merchandise"
                      fill="#805AD5"
                    />
                    <Bar
                      dataKey="buttonPins"
                      name="Button Pins"
                      fill="#D69E2E"
                    />
                    <Bar dataKey="tshirts" name="T-shirts" fill="#38A169" />
                    <Bar dataKey="ecoBags" name="Eco Bags" fill="#4F46E5" />
                  </BarChart>
                ) : chartType === "line" ? (
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value) =>
                        `₱${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="lockerRental"
                      stroke="#3182CE"
                      name="Locker Rental"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="waterVendo"
                      stroke="#38B2AC"
                      name="Water Vendo"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="merchandise"
                      stroke="#805AD5"
                      name="Merchandise"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="buttonPins"
                      stroke="#D69E2E"
                      name="Button Pins"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="tshirts"
                      stroke="#38A169"
                      name="T-shirts"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="ecoBags"
                      stroke="#4F46E5"
                      name="Eco Bags"
                      strokeWidth={2}
                    />
                    <ReferenceLine
                      y={
                        chartData.reduce((sum, item) => sum + item.total, 0) /
                        chartData.length
                      }
                      stroke="#CBD5E0"
                      strokeDasharray="3 3"
                      label="Average"
                    />
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorLockerRental"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3182CE"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3182CE"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorWaterVendo"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#38B2AC"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#38B2AC"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorMerchandise"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#805AD5"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#805AD5"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value) =>
                        `₱${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="lockerRental"
                      stroke="#3182CE"
                      fillOpacity={1}
                      fill="url(#colorLockerRental)"
                      name="Locker Rental"
                    />
                    <Area
                      type="monotone"
                      dataKey="waterVendo"
                      stroke="#38B2AC"
                      fillOpacity={1}
                      fill="url(#colorWaterVendo)"
                      name="Water Vendo"
                    />
                    <Area
                      type="monotone"
                      dataKey="merchandise"
                      stroke="#805AD5"
                      fillOpacity={1}
                      fill="url(#colorMerchandise)"
                      name="Merchandise"
                    />
                  </AreaChart>
                ) : (
                  <PieChart
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={(entry) => {
                        const igpTypeName = entry.name as IgpType
                        const igpNames: Record<IgpType, string> = {
                          lockerRental: "Locker Rental",
                          waterVendo: "Water Vendo",
                          merchandise: "Merchandise",
                          buttonPins: "Button Pins",
                          tshirts: "T-shirts",
                          ecoBags: "Eco Bags",
                        }
                        return igpNames[igpTypeName]
                      }}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `₱${Number(value).toLocaleString()}`,
                        "Sales",
                      ]}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Secondary charts (Sales by IGP & Top selling items) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by IGP</CardTitle>
            <CardDescription>
              Breakdown of sales contribution by each IGP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {igpSummaries.map((summary) => {
                const igpName = summary.igpType
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())

                return (
                  <div key={summary.igpType} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{igpName}</span>
                      <span className="font-medium text-sm">
                        {formatCurrency(summary.totalSales)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.round(summary.percentageOfTotal)}%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ backgroundColor: summary.color }}
                          className="h-full"
                        />
                      </div>
                      <span className="w-12 text-muted-foreground text-xs">
                        {Math.round(summary.percentageOfTotal)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>
              Items with the highest sales volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingItems.map((item, index) => (
                <div
                  key={item.itemName}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-medium text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.itemName}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.quantity} units sold
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-sm">
                    {formatCurrency(item.totalAmount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
