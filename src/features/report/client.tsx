"use client"

import { useFindTotalProfit } from "@/backend/actions/analytics/find-total-profit"
import { formatCurrency } from "@/utils/currency"
import { useMemo, useState } from "react"
import { processChartData } from "./data-helpers"
import { ReportSkeleton } from "./report-skeleton"
import { SalesReportHeader } from "./sales-report-header"
import { SalesReportTabs } from "./sales-report-tabs"
import { TimeRange } from "./sales-report-types"
import { SalesSummaryCards } from "./sales-summary-card"

export const ReportClient = () => {
  const { data, isLoading } = useFindTotalProfit()
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly")
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "area">(
    "bar",
  )
  const [selectedTab, setSelectedTab] = useState<"overview" | "details">(
    "overview",
  )
  const [searchTerm, setSearchTerm] = useState("")

  const processedData = useMemo(() => {
    if (!data)
      return {
        chartData: [],
        pieChartData: [],
        igpSummaries: [],
        topSellingItems: [],
        filteredSalesData: [],
      }

    const chartData = processChartData(data)
    return {
      ...chartData,
      filteredSalesData: [],
      salesData: [],
    }
  }, [data, searchTerm, timeRange])

  if (isLoading) return <ReportSkeleton />

  return (
    <div className="mx-auto space-y-6 print:px-4 print:py-0">
      <SalesReportHeader />

      {data && (
        <>
          <SalesSummaryCards
            totalSales={data.data.totalRevenue}
            totalProfit={data.data.netProfit}
            salesGrowth={data.keyMetrics.salesGrowth}
            profitGrowth={data.keyMetrics.profitGrowth}
            topIgp={data.keyMetrics.topIgp}
            transactionCount={data.keyMetrics.transactionCount}
            formatCurrency={formatCurrency}
          />

          <SalesReportTabs
            selectedTab={selectedTab}
            onTabChange={(value) =>
              setSelectedTab(value as "overview" | "details")
            }
            timeRange={timeRange}
            onTimeRangeChange={(value) => setTimeRange(value as TimeRange)}
            chartType={chartType}
            onChartTypeChange={(value) =>
              setChartType(value as "bar" | "line" | "pie" | "area")
            }
            chartData={processedData.chartData}
            pieChartData={processedData.pieChartData}
            igpSummaries={processedData.igpSummaries}
            topSellingItems={processedData.topSellingItems}
            filteredSalesData={processedData.filteredSalesData}
            salesData={data.igpRevenues}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            formatCurrency={formatCurrency}
          />
        </>
      )}
    </div>
  )
}
