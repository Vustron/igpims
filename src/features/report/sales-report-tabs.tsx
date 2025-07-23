import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"
import { BarChart3, LineChart, PieChart } from "lucide-react"
import { SalesOverview } from "./overview-tab"
import { TimeRange } from "./sales-report-types"

interface SalesReportTabsProps {
  selectedTab: "overview" | "details"
  onTabChange: (value: string) => void
  timeRange: TimeRange
  onTimeRangeChange: (value: string) => void
  chartType: "bar" | "line" | "pie" | "area"
  onChartTypeChange: (value: string) => void
  chartData: any[]
  pieChartData: { name: string; value: number; color: string }[]
  igpSummaries: any[]
  topSellingItems: { itemName: string; quantity: number; totalAmount: number }[]
  filteredSalesData: any[]
  salesData: any[]
  searchTerm: string
  onSearchTermChange: (value: string) => void
  formatCurrency: (amount: number) => string
}

export const SalesReportTabs = ({
  timeRange,
  onTimeRangeChange,
  chartType,
  onChartTypeChange,
  chartData,
  pieChartData,
  igpSummaries,
  topSellingItems,
  formatCurrency,
}: SalesReportTabsProps) => {
  // Chart type icons
  const chartIcons = {
    bar: <BarChart3 className="h-4 w-4" />,
    line: <LineChart className="h-4 w-4" />,
    pie: <PieChart className="h-4 w-4" />,
    area: <LineChart className="h-4 w-4" />,
  }

  return (
    <div className="space-y-4">
      {/* Controls Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="h-9 w-[120px] sm:h-8">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger className="h-9 w-[120px] sm:h-8">
              <div className="flex items-center gap-2">
                {chartIcons[chartType]}
                <SelectValue placeholder="Chart type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="pie">Pie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4">
        <SalesOverview
          chartType={chartType}
          chartData={chartData}
          pieChartData={pieChartData}
          igpSummaries={igpSummaries}
          topSellingItems={topSellingItems}
          timeRange={timeRange}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  )
}
