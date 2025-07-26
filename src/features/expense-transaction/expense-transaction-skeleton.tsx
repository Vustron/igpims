"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/cards"
import { Skeleton } from "@/components/ui/fallbacks"

export const ExpenseTransactionSkeleton = () => {
  return (
    <div className="mt-2 space-y-4">
      {/* Fund Summary Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((id) => (
          <Card key={id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
              {id === 4 && <Skeleton className="mt-2 h-2 w-full" />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table Skeleton */}
      <div className="rounded-md border">
        {/* Table Header Skeleton */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        {/* Search and Filter Skeleton */}
        <div className="flex items-center justify-between p-4 border-t">
          <Skeleton className="h-9 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        {/* Table Headers Skeleton */}
        <div className="grid grid-cols-12 gap-4 p-4 border-t">
          {[1, 2, 3, 4, 5, 6, 7].map((col) => (
            <Skeleton key={col} className="h-4 col-span-1" />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-12 gap-4 p-4 border-t">
            {[1, 2, 3, 4, 5, 6, 7].map((col) => (
              <Skeleton key={col} className="h-4 col-span-1" />
            ))}
          </div>
        ))}

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between p-4 border-t">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
