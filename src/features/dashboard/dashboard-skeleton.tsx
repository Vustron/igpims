"use client"

import { Skeleton } from "@/components/ui/fallbacks"

export const DashboardSkeleton = () => {
  return (
    <div className="p-5 space-y-4">
      {/* Top cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((id) => (
          <div key={id} className="p-4 border rounded-lg">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-6 w-2/3 mb-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts section skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* IGP Performance skeleton */}
        <div className="md:col-span-3 p-4 border rounded-lg">
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>

        {/* Right column skeleton */}
        <div className="md:col-span-2 space-y-4">
          {/* Revenue Analytics skeleton */}
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>

          {/* Sales Overview skeleton */}
          <div className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="flex">
              <Skeleton className="h-40 w-1/2" />
              <div className="w-1/2 pl-4 space-y-3">
                {[1, 2, 3].map((id) => (
                  <div key={id} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-8" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
