export type IgpType =
  | "lockerRental"
  | "waterVendo"
  | "merchandise"
  | "buttonPins"
  | "tshirts"
  | "ecoBags"

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
  merchandise: number
  buttonPins: number
  tshirts: number
  ecoBags: number
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
  merchandise: { label: "Merchandise", color: "#805AD5" },
  buttonPins: { label: "Button Pins", color: "#D69E2E" },
  tshirts: { label: "T-shirts", color: "#38A169" },
  ecoBags: { label: "Eco Bags", color: "#4F46E5" },
  total: { label: "Total", color: "#000000" },
}

export const igpColorMap: Record<IgpType, string> = {
  lockerRental: "#3182CE",
  waterVendo: "#38B2AC",
  merchandise: "#805AD5",
  buttonPins: "#D69E2E",
  tshirts: "#38A169",
  ecoBags: "#4F46E5",
}

export const igpLabelMap: Record<IgpType, string> = {
  lockerRental: "Locker Rental",
  waterVendo: "Water Vendo",
  merchandise: "Merchandise",
  buttonPins: "Button Pins",
  tshirts: "T-shirts",
  ecoBags: "Eco Bags",
}
