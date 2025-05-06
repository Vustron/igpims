import { TrendingDown, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/cards"

interface DashboardCardItemProps {
  id: string
  title: string
  amount: string
  metric?: string
  percentageChange: string
  trendDescription?: string
  icon?: React.ReactNode
}

interface DashboardCardProps {
  items: DashboardCardItemProps[]
}

export const DashboardCard = ({ items }: DashboardCardProps) => {
  return (
    <>
      {items.map((item) => (
        <Card
          key={item.id}
          className="col-span-full p-3 sm:col-span-2 sm:p-4 md:p-6 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-medium text-gray-500 text-xs sm:text-sm">
                {item.title}
              </p>
              <h2 className="font-bold text-base sm:text-lg md:text-xl">
                {item.amount}
              </h2>
            </div>
            {item.icon && (
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                {item.icon}
              </div>
            )}
          </div>

          <div className="mt-3 sm:mt-4 md:mt-6">
            <div className="flex items-center gap-1.5">
              <span
                className={`flex items-center gap-1 text-2xs sm:text-xs ${
                  item.percentageChange.startsWith("+") ||
                  item.percentageChange.startsWith("0")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.percentageChange.startsWith("+") ||
                item.percentageChange.startsWith("0") ? (
                  <TrendingUp className="size-3 sm:size-4" />
                ) : (
                  <TrendingDown className="size-3 sm:size-4" />
                )}
                {item.percentageChange}
              </span>
              <span className="text-2xs text-gray-500 sm:text-xs">
                {item.trendDescription || "vs previous period"}
              </span>
            </div>
            {item.metric && (
              <p className="mt-1 text-2xs text-gray-400 sm:text-xs">
                {item.metric}
              </p>
            )}
          </div>
        </Card>
      ))}
    </>
  )
}
