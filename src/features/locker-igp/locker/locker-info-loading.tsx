import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/cards"

export const LockerInfoLoadingState = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-xl dark:from-slate-900 dark:to-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <Loader2 className="relative h-12 w-12 animate-spin text-primary sm:h-16 sm:w-16" />
          </div>
          <div className="mt-6 text-center">
            <h3 className="font-semibold text-lg text-slate-900 sm:text-xl dark:text-slate-100">
              Loading Locker Information
            </h3>
            <p className="mt-2 text-slate-600 text-sm sm:text-base dark:text-slate-400">
              Please wait while we fetch the details...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
