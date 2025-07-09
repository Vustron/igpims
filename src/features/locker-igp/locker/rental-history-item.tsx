import { Badge } from "@/components/ui/badges"
import { Label } from "@/components/ui/labels"
import { cn } from "@/utils/cn"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import {
  getPaymentStatusColor,
  getRentalStatusColor,
} from "@/utils/status-color"
import { Locker } from "@/validation/locker"

interface RentalHistoryItemProps {
  rental: any
  index: number
  totalCount: number
  locker?: Locker
}

export const RentalHistoryItem = ({
  rental,
  index,
  totalCount,
  locker,
}: RentalHistoryItemProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all hover:shadow-md",
        index === 0
          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
          : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800",
      )}
    >
      {/* Mobile-first header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={index === 0 ? "default" : "secondary"}
            className="text-xs"
          >
            {index === 0 ? "Most Recent" : `#${totalCount - index}`}
          </Badge>
          <Badge
            className={cn(
              "text-xs hover:text-white",
              getRentalStatusColor(rental.rentalStatus),
            )}
          >
            {rental.rentalStatus?.toUpperCase()}
          </Badge>
          <Badge
            className={cn(
              "text-xs hover:text-white",
              getPaymentStatusColor(rental.paymentStatus),
            )}
          >
            {rental.paymentStatus?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Mobile-optimized content grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label className="font-medium text-slate-600 text-xs dark:text-slate-400">
            Student Details
          </Label>
          <p className="font-medium text-slate-900 text-sm dark:text-slate-100">
            {rental.renterName}
          </p>
          <p className="text-slate-500 text-xs dark:text-slate-400">
            {rental.renterId}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-slate-600 text-xs dark:text-slate-400">
            Course & Set
          </Label>
          <p className="font-medium text-slate-900 text-sm dark:text-slate-100">
            {rental.courseAndSet}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-slate-600 text-xs dark:text-slate-400">
            Rental Period
          </Label>
          <p className="font-medium text-slate-900 text-sm dark:text-slate-100">
            {formatDateFromTimestamp(rental.dateRented)}
          </p>
          <p className="text-slate-500 text-xs dark:text-slate-400">
            to {formatDateFromTimestamp(rental.dateDue)}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="font-medium text-slate-600 text-xs dark:text-slate-400">
            Amount Paid
          </Label>
          <p className="font-bold text-green-600 text-sm dark:text-green-400">
            ₱{locker?.lockerRentalPrice?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
    </div>
  )
}
