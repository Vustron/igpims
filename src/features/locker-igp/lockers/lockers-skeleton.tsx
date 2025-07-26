"use client"

import { Skeleton } from "@/components/ui/fallbacks"
import { motion } from "framer-motion"

export const LockersSkeleton = ({ isSidebarOpen = false }) => {
  const containerPadding = isSidebarOpen
    ? "p-2 sm:p-2 md:p-3 lg:p-4"
    : "p-2 sm:p-3 md:p-4 lg:p-6"

  const getGridLayoutClass = () => {
    return isSidebarOpen
      ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      : "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
  }

  return (
    <div
      className={`-mt-12 flex min-h-screen w-full flex-col ${containerPadding}`}
    >
      {/* Filter Skeleton */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-full sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Locker Grid Skeleton */}
      <motion.div
        className={getGridLayoutClass()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[...Array(12)].map((_, index) => (
          <div key={index} className="relative">
            <div
              className={`relative flex flex-col items-center justify-start overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 ${
                isSidebarOpen
                  ? "h-50 w-24 p-2"
                  : "h-50 w-28 p-2 sm:h-50 sm:w-30 sm:p-2.5 md:h-50 md:w-32 md:p-3"
              }`}
            >
              {/* Status Indicator */}
              <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gray-400" />

              {/* Header */}
              <div className="w-full space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>

              {/* Door */}
              <div className="my-2 h-16 w-16 rounded-md bg-gray-400/30" />

              {/* Controls */}
              <div className="flex w-full justify-between">
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-3 w-6" />
              </div>
            </div>

            {/* Shadow */}
            <div className="absolute inset-x-2 -bottom-1 h-2 rounded-b-md bg-gray-300/30 blur-sm" />
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

export const LockerCardSkeleton = ({ compact = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${compact ? "max-w-[100px]" : "max-w-[115px]"}`}
    >
      <div
        className={`relative flex flex-col items-center justify-start overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 ${
          compact
            ? "h-50 w-24 p-2"
            : "h-50 w-28 p-2 sm:h-50 sm:w-30 sm:p-2.5 md:h-50 md:w-32 md:p-3"
        }`}
      >
        {/* Status Indicator */}
        <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gray-400" />

        {/* Header */}
        <div className="w-full space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Door */}
        <div className="my-2 h-16 w-16 rounded-md bg-gray-400/30" />

        {/* Controls */}
        <div className="flex w-full justify-between">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-6" />
        </div>
      </div>

      {/* Shadow */}
      <div className="absolute inset-x-2 -bottom-1 h-2 rounded-b-md bg-gray-300/30 blur-sm" />
    </motion.div>
  )
}
