"use client"

import { useMemo, useState } from "react"
import { processSalesData } from "./data-helpers"
import { generateMockSalesData } from "./mock-data"
import { SalesReportHeader } from "./sales-report-header"
import { SalesReportTabs } from "./sales-report-tabs"
import { SalesData, TimeRange } from "./sales-report-types"
import { SalesSummaryCards } from "./sales-summary-card"

export const ReportClient = () => {
  const [salesData] = useState<SalesData[]>(generateMockSalesData())
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly")
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "area">(
    "bar",
  )
  const [selectedTab, setSelectedTab] = useState<"overview" | "details">(
    "overview",
  )
  const [searchTerm, setSearchTerm] = useState("")

  const processedData = useMemo(() => {
    return processSalesData(salesData, searchTerm, timeRange)
  }, [salesData, searchTerm, timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="mx-auto space-y-6 print:px-4 print:py-0">
      <SalesReportHeader />

      <SalesSummaryCards
        totalSales={processedData.totalSales}
        totalProfit={processedData.totalProfit}
        salesGrowth={processedData.salesGrowth}
        profitGrowth={processedData.profitGrowth}
        topIgp={processedData.igpSummaries[0]}
        transactionCount={salesData.length}
        formatCurrency={formatCurrency}
      />

      <SalesReportTabs
        selectedTab={selectedTab}
        onTabChange={(value) => setSelectedTab(value as "overview" | "details")}
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
        salesData={salesData}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        formatCurrency={formatCurrency}
      />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          h1 { font-size: 20px !important; }
          h2 { font-size: 16px !important; }
          p { font-size: 12px !important; }
        }
      `}</style>
    </div>
  )
}
