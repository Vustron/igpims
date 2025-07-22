import { Card, CardContent } from "@/components/ui/cards"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  FileText,
  LineChart,
  PieChart,
} from "lucide-react"

const SummaryCard = ({
  title,
  value,
  trend,
  trendPercentage,
  icon,
  colorClass,
}: {
  title: string
  value: string
  trend: "up" | "down" | "neutral"
  trendPercentage: number
  icon: React.ReactNode
  colorClass: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">{title}</p>
              <p className={cn("mt-1 font-bold text-2xl", colorClass)}>
                {value}
              </p>
            </div>
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                colorClass.replace("text", "bg").replace("700", "100"),
              )}
            >
              {icon}
            </div>
          </div>

          <div className="mt-2">
            <span
              className={cn(
                "flex items-center font-medium text-xs",
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-slate-600",
              )}
            >
              {trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : trend === "down" ? (
                <ArrowDown className="mr-1 h-3 w-3" />
              ) : null}
              {trendPercentage}%{" "}
              {trend === "up"
                ? "increase"
                : trend === "down"
                  ? "decrease"
                  : "change"}{" "}
              from last month
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface SalesSummaryCardsProps {
  totalSales?: number
  totalProfit?: number
  salesGrowth?: number
  profitGrowth?: number
  topIgp?: {
    igpName: string
    igpType: string
    percentageOfTotal: number
  }
  transactionCount?: number
  formatCurrency: (amount: number) => string
  isLoading?: boolean
}

export const SalesSummaryCards = ({
  totalSales = 0,
  totalProfit = 0,
  salesGrowth = 0,
  profitGrowth = 0,
  topIgp,
  transactionCount = 0,
  formatCurrency,
  isLoading = false,
}: SalesSummaryCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="mt-2 h-6 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-full rounded bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Sales"
        value={formatCurrency(totalSales)}
        trend={salesGrowth >= 0 ? "up" : "down"}
        trendPercentage={Math.abs(Math.round(salesGrowth * 10) / 10)}
        icon={<BarChart3 className="h-5 w-5 text-blue-700" />}
        colorClass="text-blue-700"
      />
      <SummaryCard
        title="Total Profit"
        value={formatCurrency(totalProfit)}
        trend={profitGrowth >= 0 ? "up" : "down"}
        trendPercentage={Math.abs(Math.round(profitGrowth * 10) / 10)}
        icon={<LineChart className="h-5 w-5 text-emerald-700" />}
        colorClass="text-emerald-700"
      />
      <SummaryCard
        title="Top IGP"
        value={topIgp?.igpName || "N/A"}
        trend="neutral"
        trendPercentage={Math.round(topIgp?.percentageOfTotal || 0)}
        icon={<PieChart className="h-5 w-5 text-purple-700" />}
        colorClass="text-purple-700"
      />
      <SummaryCard
        title="Total Transactions"
        value={transactionCount.toString()}
        trend={transactionCount >= 0 ? "up" : "down"}
        trendPercentage={0} // You can calculate this if you have previous data
        icon={<FileText className="h-5 w-5 text-amber-700" />}
        colorClass="text-amber-700"
      />
    </div>
  )
}
