"use client"

import { Skeleton } from "@/components/ui/fallbacks"
import { ProjectRequestFilter } from "./project-request-filter"

export const ProjectRequestSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="mt-2 mb-6">
        <ProjectRequestFilter onFilterChange={() => {}} requests={[]} />
      </div>

      <div className="mb-4">
        <Skeleton className="h-5 w-48" />
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
