import { igpColorMap } from "@/features/report/sales-report-types"

import type {
  IgpType,
  SalesData,
  TimeRange,
  IgpSummary,
  MonthlySales,
  ProcessedSalesData,
} from "@/features/report/sales-report-types"

export function generateMonthlySalesData(
  salesData: SalesData[],
): MonthlySales[] {
  const monthlyData: Record<string, MonthlySales> = {}

  // Initialize monthly data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const today = new Date()
  const currentMonth = today.getMonth()

  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    const year = today.getFullYear() - (currentMonth < i ? 1 : 0)
    const monthKey = `${year}-${(monthIndex + 1).toString().padStart(2, "0")}`

    monthlyData[monthKey] = {
      month: months[monthIndex] || "Unknown",
      lockerRental: 0,
      waterVendo: 0,
      merchandise: 0,
      buttonPins: 0,
      tshirts: 0,
      ecoBags: 0,
      total: 0,
    }
  }

  // Populate with sales data
  salesData.forEach((sale) => {
    const date = sale.date
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

    if (monthlyData[monthKey]) {
      monthlyData[monthKey][sale.igpType] += sale.totalAmount
      monthlyData[monthKey].total += sale.totalAmount
    }
  })

  // Convert to array and sort by month
  return Object.values(monthlyData).sort((a, b) => {
    const monthA = months.indexOf(a.month)
    const monthB = months.indexOf(b.month)
    return monthA - monthB
  })
}

export function processSalesData(
  salesData: SalesData[],
  searchTerm: string,
  timeRange: TimeRange,
): ProcessedSalesData {
  // Generate monthly summaries
  const monthlySalesData = generateMonthlySalesData(salesData)

  // Filter data based on search term
  const filteredSalesData = salesData.filter(
    (sale) =>
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.igpType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate summaries for each IGP type
  const igpSummaries: IgpSummary[] = []
  const totalSalesAmount = salesData.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0,
  )

  const igpTypes: IgpType[] = [
    "lockerRental",
    "waterVendo",
    "merchandise",
    "buttonPins",
    "tshirts",
    "ecoBags",
  ]

  igpTypes.forEach((igpType) => {
    const typeData = salesData.filter((sale) => sale.igpType === igpType)
    const totalSales = typeData.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalItems = typeData.reduce((sum, sale) => sum + sale.quantity, 0)
    const totalProfit = typeData.reduce((sum, sale) => sum + sale.profit, 0)
    const percentageOfTotal = (totalSales / totalSalesAmount) * 100

    igpSummaries.push({
      igpType,
      totalSales,
      totalItems,
      totalProfit,
      percentageOfTotal,
      color: igpColorMap[igpType],
    })
  })

  // Sort IGP summaries by total sales
  igpSummaries.sort((a, b) => b.totalSales - a.totalSales)

  // Calculate top selling items
  const itemSalesMap: Record<
    string,
    { quantity: number; totalAmount: number }
  > = {}
  salesData.forEach((sale) => {
    if (!itemSalesMap[sale.itemName]) {
      itemSalesMap[sale.itemName] = { quantity: 0, totalAmount: 0 }
    }
    const data = itemSalesMap[sale.itemName]
    data!.quantity += sale.quantity
    data!.totalAmount += sale.totalAmount
  })

  const topSellingItems = Object.entries(itemSalesMap)
    .map(([itemName, data]) => ({ itemName, ...data }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5)

  // Calculate total sales and profit
  const totalSales = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalProfit = salesData.reduce((sum, sale) => sum + sale.profit, 0)

  // Calculate growth percentages (comparing current month to previous month)
  const currentMonthData = monthlySalesData[monthlySalesData.length - 1]
  const previousMonthData = monthlySalesData[monthlySalesData.length - 2]

  const salesGrowth =
    previousMonthData && currentMonthData
      ? ((currentMonthData.total - previousMonthData.total) /
          previousMonthData.total) *
        100
      : 0

  // Calculate profit growth
  const currentMonthProfit = salesData
    .filter((sale) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return (
        sale.date.getMonth() === currentMonth &&
        sale.date.getFullYear() === currentYear
      )
    })
    .reduce((sum, sale) => sum + sale.profit, 0)

  const previousMonthProfit = salesData
    .filter((sale) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      return (
        sale.date.getMonth() === prevMonth &&
        sale.date.getFullYear() === prevYear
      )
    })
    .reduce((sum, sale) => sum + sale.profit, 0)

  const profitGrowth = previousMonthProfit
    ? ((currentMonthProfit - previousMonthProfit) / previousMonthProfit) * 100
    : 0

  // Prepare chart data based on selected time range
  let chartData = []
  if (timeRange === "monthly") {
    chartData = monthlySalesData
  } else {
    // Additional time range processing can be added here
    chartData = monthlySalesData
  }

  // Prepare pie chart data
  const pieChartData = igpSummaries.map((summary) => ({
    name: summary.igpType,
    value: summary.totalSales,
    color: summary.color,
  }))

  return {
    monthlySalesData,
    filteredSalesData,
    igpSummaries,
    topSellingItems,
    totalSales,
    totalProfit,
    salesGrowth,
    profitGrowth,
    chartData,
    pieChartData,
  }
}
