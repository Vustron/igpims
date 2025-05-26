import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/separators"
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/selects"
import { BarChart3, LineChart, PieChart, RefreshCw } from "lucide-react"
import { SalesOverviewTab } from "@/features/report/overview-tab"
import { SalesDetailsTab } from "@/features/report/details-tab"
import { Button } from "@/components/ui/buttons"

import type {
  SalesData,
  TimeRange,
  IgpSummary,
  MonthlySales,
} from "@/features/report/sales-report-types"

interface SalesReportTabsProps {
  selectedTab: "overview" | "details"
  onTabChange: (value: string) => void
  timeRange: TimeRange
  onTimeRangeChange: (value: string) => void
  chartType: "bar" | "line" | "pie" | "area"
  onChartTypeChange: (value: string) => void
  chartData: MonthlySales[]
  pieChartData: { name: string; value: number; color: string }[]
  igpSummaries: IgpSummary[]
  topSellingItems: { itemName: string; quantity: number; totalAmount: number }[]
  filteredSalesData: SalesData[]
  salesData: SalesData[]
  searchTerm: string
  onSearchTermChange: (value: string) => void
  formatCurrency: (amount: number) => string
}

export const SalesReportTabs = ({
  selectedTab,
  onTabChange,
  timeRange,
  onTimeRangeChange,
  chartType,
  onChartTypeChange,
  chartData,
  pieChartData,
  igpSummaries,
  topSellingItems,
  filteredSalesData,
  salesData,
  searchTerm,
  onSearchTermChange,
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
    <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="mb-4 w-full sm:mb-0 sm:w-auto">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">
            Overview
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1 sm:flex-none">
            Details
          </TabsTrigger>
        </TabsList>

        <div className="flex space-x-2 print:hidden">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="h-8 w-[120px]">
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
            <SelectTrigger className="h-8 w-[120px]">
              <div className="flex items-center gap-2">
                {chartIcons[chartType]}
                <SelectValue placeholder="Chart type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="line" className="text-xs">
                Line
              </SelectItem>
              <SelectItem value="area" className="text-xs">
                Area
              </SelectItem>
              <SelectItem value="pie" className="text-xs">
                Pie
              </SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh data</span>
          </Button>
        </div>
      </div>

      {/* Tab contents */}
      <TabsContent value="overview" className="mt-6 space-y-6">
        <SalesOverviewTab
          chartType={chartType}
          chartData={chartData}
          pieChartData={pieChartData}
          igpSummaries={igpSummaries}
          topSellingItems={topSellingItems}
          timeRange={timeRange}
          formatCurrency={formatCurrency}
        />
      </TabsContent>

      <TabsContent value="details" className="mt-6 space-y-6">
        <SalesDetailsTab
          filteredSalesData={filteredSalesData}
          salesData={salesData}
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
          formatCurrency={formatCurrency}
        />
      </TabsContent>
    </Tabs>
  )
}
