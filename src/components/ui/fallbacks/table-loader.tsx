"use client"

import { Skeleton } from "@/components/ui/fallbacks"

export const TableLoadingState = () => {
  return (
    <div className="mt-2 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}
