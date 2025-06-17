import { Button } from "@/components/ui/buttons"
import { PiLockers } from "react-icons/pi"
import { Trash2 } from "lucide-react"

import type { Locker } from "@/schemas/locker"

interface LockerInfoHeaderProps {
  id: string
  locker?: Locker
  onDelete: () => void
  isDeleting: boolean
}

export const LockerInfoHeader = ({
  id,
  locker,
  onDelete,
  isDeleting,
}: LockerInfoHeaderProps) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 sticky top-0 z-10 bg-background/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
            <PiLockers className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-bold text-slate-900 text-xl sm:text-2xl dark:text-slate-100">
              Locker {locker?.lockerName || id}
            </h1>
            <p className="text-slate-600 text-sm dark:text-slate-400">
              ID: {id} • {locker?.lockerLocation || "No location set"}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="gap-2 self-start sm:self-auto"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isDeleting ? "Deleting..." : "Delete Locker"}
          </span>
          <span className="sm:hidden">
            {isDeleting ? "Deleting..." : "Delete"}
          </span>
        </Button>
      </div>
    </div>
  )
}
