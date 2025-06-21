import { Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards"
import { Locker } from "@/validation/locker"
import { RentalHistoryItem } from "./rental-history-item"

interface RentalHistoryCardProps {
  rentalHistory: any[]
  locker?: Locker
}

export const RentalHistoryCard = ({
  rentalHistory,
  locker,
}: RentalHistoryCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Rental History</CardTitle>
            <CardDescription className="text-sm">
              {rentalHistory.length}{" "}
              {rentalHistory.length === 1 ? "rental" : "rentals"} on record
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {rentalHistory.map((historyRental: any, index: number) => (
            <RentalHistoryItem
              key={historyRental.id}
              rental={historyRental}
              index={index}
              totalCount={rentalHistory.length}
              locker={locker}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
