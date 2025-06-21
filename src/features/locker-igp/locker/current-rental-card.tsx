import { User } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards"
import { Locker } from "@/validation/locker"
import { RentalDetails } from "./rental-details"
import { StudentInformation } from "./student-info"

interface CurrentRentalCardProps {
  rental: any
  locker?: Locker
}

export const CurrentRentalCard = ({
  rental,
  locker,
}: CurrentRentalCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Current Rental</CardTitle>
            <CardDescription className="text-sm">
              Active rental information for this locker
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          <StudentInformation rental={rental} />
          <RentalDetails rental={rental} locker={locker} />
        </div>
      </CardContent>
    </Card>
  )
}
