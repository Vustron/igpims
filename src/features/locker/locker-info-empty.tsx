import { Card, CardContent } from "@/components/ui/cards"
import { User } from "lucide-react"

export const LockerInfoEmptyState = () => {
  return (
    <Card className="border-2 border-slate-300 border-dashed dark:border-slate-600">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <User className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
          No Rental History
        </h3>
        <p className="mt-2 max-w-sm text-slate-600 text-sm dark:text-slate-400">
          This locker hasn't been rented yet. Once someone rents it, their
          information will appear here.
        </p>
      </CardContent>
    </Card>
  )
}
