import { Card } from "@/components/ui/cards"
import { TrendingDown, TrendingUp } from "lucide-react"

interface DashboardCardItemProps {
  id: string
  title: string
  amount: string
  metric?: string
  percentageChange: string
  trendDescription?: string
  icon?: React.ReactNode
  bgColor?: string
  textColor?: string
}

export const DashboardCard = ({ item }: { item: DashboardCardItemProps }) => {
  const isPositive =
    item.percentageChange.startsWith("+") ||
    item.percentageChange.startsWith("0")

  return (
    <Card className="relative overflow-hidden bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
      {/* Background accent */}
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${item.bgColor} opacity-20`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.title}
            </p>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {item.amount}
            </h2>
          </div>
          {item.icon && (
            <div className={`rounded-full ${item.bgColor} p-3`}>
              {item.icon}
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              {item.percentageChange}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.trendDescription || "vs previous period"}
            </span>
          </div>
          {item.metric && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {item.metric}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
