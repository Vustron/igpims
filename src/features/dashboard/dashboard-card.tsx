import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import { getPercentageChangeColor } from "@/utils/get-percentage-color"

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
          className="w-full bg-card text-card-foreground shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              {item.title}
            </CardTitle>
            {item.icon && (
              <span className="text-muted-foreground">{item.icon}</span>
            )}
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-bold text-2xl">{item.amount}</div>

            {item.metric && (
              <div className="mt-1 text-muted-foreground text-sm">
                {item.metric}
              </div>
            )}

            <div className="mt-3 flex items-center gap-1 text-xs">
              <span className={getPercentageChangeColor(item.percentageChange)}>
                {item.percentageChange}
              </span>
              {item.trendDescription && (
                <span className="text-muted-foreground">
                  {item.trendDescription}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
