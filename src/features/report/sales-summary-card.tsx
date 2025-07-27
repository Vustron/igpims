import { Card, CardContent } from "@/components/ui/cards"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  FileText,
  Info,
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
  tooltipContent,
}: {
  title: string
  value: string
  trend: "up" | "down" | "neutral"
  trendPercentage: number
  icon: React.ReactNode
  colorClass: string
  tooltipContent?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-muted-foreground text-sm truncate">
                  {title}
                </p>
                {tooltipContent && (
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="text-xs">{tooltipContent}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p
                className={cn("mt-1 font-bold text-2xl truncate", colorClass)}
                title={value}
              >
                {value}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
                colorClass.replace("text", "bg").replace("700", "100"),
              )}
            >
              {icon}
            </motion.div>
          </div>

          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span
              className={cn(
                "flex items-center font-medium text-xs truncate",
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-slate-600",
              )}
              title={`${trendPercentage}% ${trend === "up" ? "increase" : trend === "down" ? "decrease" : "change"} from last month`}
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
          </motion.div>
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
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-6 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
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
        tooltipContent="Total revenue generated from all sales"
      />
      <SummaryCard
        title="Total Profit"
        value={formatCurrency(totalProfit)}
        trend={profitGrowth >= 0 ? "up" : "down"}
        trendPercentage={Math.abs(Math.round(profitGrowth * 10) / 10)}
        icon={<LineChart className="h-5 w-5 text-emerald-700" />}
        colorClass="text-emerald-700"
        tooltipContent="Net profit after deducting all expenses"
      />
      <SummaryCard
        title="Top IGP"
        value={topIgp?.igpName || "N/A"}
        trend="neutral"
        trendPercentage={Math.round(topIgp?.percentageOfTotal || 0)}
        icon={<PieChart className="h-5 w-5 text-purple-700" />}
        colorClass="text-purple-700"
        tooltipContent={
          topIgp
            ? `${topIgp.igpType} contributing ${Math.round(topIgp.percentageOfTotal)}% of total sales`
            : "No top IGP data available"
        }
      />
      <SummaryCard
        title="Total Transactions"
        value={transactionCount.toString()}
        trend={transactionCount >= 0 ? "up" : "down"}
        trendPercentage={Math.round(topIgp?.percentageOfTotal || 0)}
        icon={<FileText className="h-5 w-5 text-amber-700" />}
        colorClass="text-amber-700"
        tooltipContent="Total number of completed transactions"
      />
    </div>
  )
}
