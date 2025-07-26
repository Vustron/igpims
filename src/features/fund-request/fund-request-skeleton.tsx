"use client"

import { Skeleton } from "@/components/ui/fallbacks"
import { motion } from "framer-motion"

export const FundRequestSkeleton = ({ isSidebarOpen = false }) => {
  const containerPadding = isSidebarOpen
    ? "p-2 sm:p-2 md:p-3 lg:p-4"
    : "p-2 sm:p-3 md:p-4 lg:p-6"

  return (
    <div
      className={`-mt-5 flex min-h-screen w-full flex-col ${containerPadding}`}
    >
      {/* Filter Skeleton */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "pending", "in_review", "approved", "rejected"].map(
            (status) => (
              <Skeleton key={status} className="h-9 w-20 rounded-full" />
            ),
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-full sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Results Count Skeleton */}
      <Skeleton className="mb-4 h-4 w-48" />

      {/* Fund Request Cards Skeleton */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[1, 2, 3].map((id) => (
          <div key={id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Pagination Skeleton */}
      <div className="mt-6 flex justify-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}
