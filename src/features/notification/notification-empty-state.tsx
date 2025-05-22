import { Button } from "@/components/ui/buttons"
import { Card } from "@/components/ui/cards"
import { Clock } from "lucide-react"

interface NotificationEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export const NotificationEmptyState = ({
  hasFilters,
  onClearFilters,
}: NotificationEmptyStateProps) => {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <Clock className="mb-4 h-12 w-12 text-slate-300" />
      {hasFilters ? (
        <>
          <h3 className="font-semibold text-lg">No matching notifications</h3>
          <p className="text-muted-foreground text-sm">
            Try changing your search or filter criteria
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-lg">No notifications yet</h3>
          <p className="text-muted-foreground text-sm">
            Notifications about your fund requests and IGP proposals will appear
            here
          </p>
        </>
      )}
    </Card>
  )
}
