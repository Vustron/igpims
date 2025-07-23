import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts"
import { motion } from "framer-motion"
import { useId } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  IgpSummary,
  MonthlySales,
  TimeRange,
  chartConfig,
} from "./sales-report-types"

interface SalesOverviewTabProps {
  chartType: "bar" | "line" | "pie" | "area"
  chartData: MonthlySales[]
  pieChartData: { name: string; value: number; color: string }[]
  igpSummaries: IgpSummary[]
  topSellingItems: { itemName: string; quantity: number; totalAmount: number }[]
  timeRange: TimeRange
  formatCurrency: (amount: number) => string
}

export const SalesOverview = ({
  chartType,
  chartData,
  pieChartData,
  igpSummaries,
  topSellingItems,
  timeRange,
  formatCurrency,
}: SalesOverviewTabProps) => {
  const colorRentalId = useId()
  const colorWaterVendoId = useId()
  const colorMerchandiseId = useId()

  return (
    <div className="space-y-6">
      {/* Main Chart Section */}
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Sales
                Performance
              </CardTitle>
              <CardDescription className="mt-1">
                Breakdown of sales performance across different IGPs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px] w-full sm:h-[400px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `₱${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar
                      dataKey="lockerRental"
                      name="Locker Rental"
                      fill="#3182CE"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="waterVendo"
                      name="Water Vendo"
                      fill="#38B2AC"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="igp"
                      name="IGP"
                      fill="#805AD5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : chartType === "line" ? (
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `₱${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Line
                      type="monotone"
                      dataKey="lockerRental"
                      stroke="#3182CE"
                      name="Locker Rental"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="waterVendo"
                      stroke="#38B2AC"
                      name="Water Vendo"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="igp"
                      stroke="#805AD5"
                      name="IGP"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <ReferenceLine
                      y={
                        chartData.reduce((sum, item) => sum + item.total, 0) /
                        chartData.length
                      }
                      stroke="#CBD5E0"
                      strokeDasharray="3 3"
                      label={{
                        value: "Average",
                        position: "right",
                        fill: "#718096",
                        fontSize: 12,
                      }}
                    />
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
                  >
                    <defs>
                      <linearGradient
                        id={colorRentalId}
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
                        id={colorWaterVendoId}
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
                        id={colorMerchandiseId}
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
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `₱${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Area
                      type="monotone"
                      dataKey="lockerRental"
                      stroke="#3182CE"
                      fillOpacity={1}
                      fill={`url(#${colorRentalId})`}
                      name="Locker Rental"
                    />
                    <Area
                      type="monotone"
                      dataKey="waterVendo"
                      stroke="#38B2AC"
                      fillOpacity={1}
                      fill={`url(#${colorWaterVendoId})`}
                      name="Water Vendo"
                    />
                    <Area
                      type="monotone"
                      dataKey="igp"
                      stroke="#805AD5"
                      fillOpacity={1}
                      fill={`url(#${colorMerchandiseId})`}
                      name="IGP"
                    />
                  </AreaChart>
                ) : (
                  <PieChart
                    margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
                  >
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      label={({ name, percent }) =>
                        `${name}: ${(percent! * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Sales",
                      ]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      wrapperStyle={{ paddingTop: 20 }}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales by IGP Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sales by IGP</CardTitle>
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
                  <div key={summary.igpType} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {igpName}
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(summary.totalSales)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.round(summary.percentageOfTotal)}%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ backgroundColor: summary.color }}
                          className="h-full rounded-full"
                        />
                      </div>
                      <span className="w-10 text-right text-sm text-muted-foreground">
                        {Math.round(summary.percentageOfTotal)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Selling Items</CardTitle>
            <CardDescription>
              Items with the highest sales volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingItems.map((item, index) => (
                <div
                  key={`${item.itemName}-${index}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.itemName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} units sold
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.totalAmount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
