import { Calendar, Clock, DollarSign, MapPin } from "lucide-react"
import { InfoItem } from "@/features/locker/info-item"
import { Badge } from "@/components/ui/badges"

import {
  getRentalStatusColor,
  getPaymentStatusColor,
} from "@/utils/status-color"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { cn } from "@/utils/cn"

import type { Locker } from "@/schemas/locker"

interface RentalDetailsProps {
  rental: any
  locker?: Locker
}

export const RentalDetails = ({ rental, locker }: RentalDetailsProps) => {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
        <Calendar className="h-4 w-4" />
        Rental Details
      </h4>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoItem
          label="Rental Status"
          value={
            <Badge
              className={cn(
                getRentalStatusColor(rental.rentalStatus),
                "hover:text-white",
              )}
            >
              {rental.rentalStatus?.toUpperCase()}
            </Badge>
          }
        />
        <InfoItem
          label="Payment Status"
          value={
            <Badge
              className={cn(
                getPaymentStatusColor(rental.paymentStatus),
                "hover:text-white",
              )}
            >
              {rental.paymentStatus?.toUpperCase()}
            </Badge>
          }
        />
        <InfoItem
          label="Rental Price"
          value={`₱${locker?.lockerRentalPrice?.toLocaleString() || "0"}`}
          icon={<DollarSign className="h-3 w-3" />}
        />
        <InfoItem
          label="Date Rented"
          value={formatDateFromTimestamp(rental.dateRented)}
          icon={<Clock className="h-3 w-3" />}
        />
        <InfoItem
          label="Due Date"
          value={formatDateFromTimestamp(rental.dateDue)}
          icon={<Clock className="h-3 w-3" />}
        />
        <InfoItem
          label="Location"
          value={locker?.lockerLocation || "Not specified"}
          icon={<MapPin className="h-3 w-3" />}
        />
      </div>
    </div>
  )
}
