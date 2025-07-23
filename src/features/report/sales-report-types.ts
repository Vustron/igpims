export type IgpType = "lockerRental" | "waterVendo" | "igp"

export type TimeRange = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"

export type SalesData = {
  id: string
  date: Date
  igpType: IgpType
  itemName: string
  quantity: number
  unitPrice: number
  totalAmount: number
  costPrice: number
  profit: number
}

export type IgpSummary = {
  igpType: IgpType
  totalSales: number
  totalItems: number
  totalProfit: number
  percentageOfTotal: number
  color: string
}

export type MonthlySales = {
  month: string
  lockerRental: number
  waterVendo: number
  igp: number
  total: number
}

export type ProcessedSalesData = {
  monthlySalesData: MonthlySales[]
  filteredSalesData: SalesData[]
  igpSummaries: IgpSummary[]
  topSellingItems: { itemName: string; quantity: number; totalAmount: number }[]
  totalSales: number
  totalProfit: number
  salesGrowth: number
  profitGrowth: number
  chartData: MonthlySales[]
  pieChartData: { name: IgpType; value: number; color: string }[]
}

export const chartConfig = {
  lockerRental: { label: "Locker Rental", color: "#3182CE" },
  waterVendo: { label: "Water Vendo", color: "#38B2AC" },
  igp: { label: "Igp", color: "#805AD5" },
  total: { label: "Total", color: "#000000" },
}

export const igpColorMap: Record<IgpType, string> = {
  lockerRental: "#3182CE",
  waterVendo: "#38B2AC",
  igp: "#805AD5",
}

export const igpLabelMap: Record<IgpType, string> = {
  lockerRental: "Locker Rental",
  waterVendo: "Water Vendo",
  igp: "Igp",
}
