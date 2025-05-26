"use client"

import { SalesReportHeader } from "@/features/sales-report/sales-report-header"
import { SalesSummaryCards } from "@/features/sales-report/sales-summary-card"
import { SalesReportTabs } from "@/features/sales-report/sales-report-tabs"

import { useState, useMemo } from "react"

import { generateMockSalesData } from "@/features/sales-report/mock-data"
import { processSalesData } from "@/features/sales-report/data-helpers"

import type {
  SalesData,
  TimeRange,
} from "@/features/sales-report/sales-report-types"

export const SalesReportClient = () => {
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
      <SalesReportHeader
        onPrint={() => window.print()}
        onExport={() => {
          // CSV export logic...
          const headers = [
            "ID",
            "Date",
            "IGP Type",
            "Item",
            "Quantity",
            "Unit Price",
            "Total Amount",
            "Profit",
          ]

          const csvContent = [
            headers.join(","),
            ...processedData.filteredSalesData.map((sale) =>
              [
                sale.id,
                sale.date.toLocaleDateString(),
                sale.igpType,
                sale.itemName,
                sale.quantity,
                sale.unitPrice,
                sale.totalAmount,
                sale.profit,
              ].join(","),
            ),
          ].join("\n")

          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          })
          const link = document.createElement("a")
          const url = URL.createObjectURL(blob)
          link.setAttribute("href", url)
          link.setAttribute(
            "download",
            `igp_sales_report_${new Date().toISOString().split("T")[0]}.csv`,
          )
          link.style.visibility = "hidden"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }}
      />

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
