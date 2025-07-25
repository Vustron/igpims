"use client"

import { Card, CardContent } from "@/components/ui/cards"

export const ReportSkeleton = () => {
  return (
    <div className="mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-64 rounded bg-gray-200" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-6 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls Skeleton */}
      <div className="flex flex-wrap gap-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-9 w-32 rounded bg-gray-200 sm:h-8" />
        ))}
      </div>

      {/* Chart Area Skeleton */}
      <div className="rounded-lg border p-4">
        <div className="flex justify-between">
          <div className="h-6 w-24 rounded bg-gray-200" />
          <div className="h-6 w-6 rounded bg-gray-200" />
        </div>
        <div className="mt-4 h-64 w-full rounded bg-gray-200" />
      </div>

      {/* Tables Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="h-6 w-32 rounded bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-10 w-full rounded bg-gray-200" />
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-12 w-full rounded bg-gray-200" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
