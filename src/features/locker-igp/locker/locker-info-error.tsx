import { Card, CardContent } from "@/components/ui/cards"
import { Button } from "@/components/ui/buttons"
import { PiLockers } from "react-icons/pi"

export const LockerInfoErrorState = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <Card className="border-red-200 bg-red-50 shadow-xl dark:border-red-800 dark:bg-red-950">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 sm:h-20 sm:w-20 dark:bg-red-900">
            <PiLockers className="h-8 w-8 text-red-600 sm:h-10 sm:w-10 dark:text-red-400" />
          </div>
          <h3 className="font-semibold text-lg text-red-900 sm:text-xl dark:text-red-100">
            Failed to Load Locker Information
          </h3>
          <p className="mt-2 max-w-md text-red-700 text-sm sm:text-base dark:text-red-300">
            There was an error retrieving the locker data. Please check your
            connection and try again.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6"
            variant="destructive"
          >
            Retry Loading
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
