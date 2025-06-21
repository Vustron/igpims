import { GiClothes, GiDroplets, GiLockers } from "react-icons/gi"
import { Card } from "@/components/ui/cards"
import { cn } from "@/utils/cn"

export const IgpActivity = () => {
  return (
    <Card className="col-span-full h-full w-full p-3 sm:col-span-2 sm:p-4 md:p-6">
      <h3 className="mb-2 font-semibold text-sm sm:mb-4 sm:text-base md:mb-6 md:text-lg">
        IGP Activity
      </h3>
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <ActivityItem
          icon={
            <GiLockers className="text-gray-600 text-lg sm:text-xl md:text-2xl" />
          }
          title="Locker - 1 locker rented per semester"
          description="₱ 150 for Large and ₱100 for small"
        />
        <ActivityItem
          icon={
            <GiDroplets className="text-gray-600 text-lg sm:text-xl md:text-2xl" />
          }
          title="Water Vendo - 15 Gallons sold"
        />
        <ActivityItem
          icon={
            <GiClothes className="text-gray-600 text-lg sm:text-xl md:text-2xl" />
          }
          title="Merchandise - T-shirt sales"
          description="₱ 5,300"
        />
      </div>
    </Card>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  title: string
  description?: string
  className?: string
}

const ActivityItem = ({
  icon,
  title,
  description,
  className,
}: ActivityItemProps) => {
  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-xs sm:text-sm md:text-base">
          {title}
        </p>
        {description && (
          <p className="truncate text-2xs text-muted-foreground sm:text-xs md:text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
