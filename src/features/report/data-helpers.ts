import { ProfitData } from "@/backend/actions/analytics/find-total-profit"

export const processChartData = (apiData: ProfitData) => {
  const chartData = apiData.monthlyRevenue.map((month) => ({
    month: month.month,
    lockerRental: month.lockerRentals,
    waterVendo: month.waterVendo,
    merchandise: month.igpRevenue,
  }))

  const pieChartData = [
    {
      name: "lockerRental",
      value: apiData.data.totalLockerRevenue,
      color: "#3182CE",
    },
    {
      name: "waterVendo",
      value: apiData.data.totalWaterRevenue,
      color: "#38B2AC",
    },
    {
      name: "igp",
      value: apiData.data.totalIgpRevenue,
      color: "#805AD5",
    },
  ]

  const totalRevenue = apiData.data.totalRevenue || 1
  const igpSummaries = [
    {
      igpType: "lockerRental",
      totalSales: apiData.data.totalLockerRevenue,
      percentageOfTotal: (apiData.data.totalLockerRevenue / totalRevenue) * 100,
      color: "#3182CE",
    },
    {
      igpType: "waterVendo",
      totalSales: apiData.data.totalWaterRevenue,
      percentageOfTotal: (apiData.data.totalWaterRevenue / totalRevenue) * 100,
      color: "#38B2AC",
    },
    {
      igpType: "igp",
      totalSales: apiData.data.totalIgpRevenue,
      percentageOfTotal: (apiData.data.totalIgpRevenue / totalRevenue) * 100,
      color: "#805AD5",
    },
  ]

  const topSellingItems = apiData.igpRevenues
    .filter((item) => item.totalSold > 0)
    .map((item) => ({
      itemName: item.name,
      quantity: item.totalSold,
      totalAmount: item.revenue,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)

  return {
    chartData,
    pieChartData,
    igpSummaries,
    topSellingItems,
  }
}
