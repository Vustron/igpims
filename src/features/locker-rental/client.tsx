"use client"

import {
  LockerFilter,
  getGridLayoutClass,
} from "@/features/locker-rental/locker-filter"
import { LockerCard } from "@/features/locker-rental/locker-card"
import { Button } from "@/components/ui/buttons"

import { useFindManyLockers } from "@/backend/actions/locker/find-many"
import { useState } from "react"

import { motion } from "framer-motion"

export const LockerRentalClient = ({ isSidebarOpen = false }) => {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [limit] = useState(12)

  const getApiStatus = (uiStatus: string) => {
    switch (uiStatus) {
      case "active":
        return "available"
      case "inactive":
        return "occupied"
      case "under_maintenance":
        return "maintenance"
      default:
        return undefined
    }
  }

  const {
    data: lockersResponse,
    isLoading,
    error,
  } = useFindManyLockers({
    page,
    limit,
    status: statusFilter !== "all" ? getApiStatus(statusFilter) : undefined,
    location: locationFilter !== "all" ? locationFilter : undefined,
    search: searchTerm || undefined,
  })

  const uniqueLocations = lockersResponse?.data
    ? Array.from(
        new Set(
          lockersResponse.data.map((locker) => {
            const mainLocation = locker.lockerLocation
              ? locker.lockerLocation.split("-")[0]?.trim() ||
                locker.lockerLocation.trim()
              : "Unknown"
            return mainLocation
          }),
        ),
      )
    : []

  const locationCounts = lockersResponse?.data
    ? {
        all: lockersResponse.data.length,
        ...Object.fromEntries(
          uniqueLocations.map((location) => [
            location,
            lockersResponse.data.filter((l) =>
              l.lockerLocation ? l.lockerLocation.includes(location) : false,
            ).length,
          ]),
        ),
      }
    : { all: 0 }

  const getUiStatus = (apiStatus: string | undefined) => {
    if (!apiStatus) return "active"

    switch (apiStatus) {
      case "available":
        return "active"
      case "occupied":
      case "reserved":
        return "inactive"
      case "maintenance":
      case "out-of-service":
        return "under_maintenance"
      default:
        return "inactive"
    }
  }

  const statusCounts = lockersResponse?.data
    ? {
        all: lockersResponse.data.length,
        active: lockersResponse.data.filter(
          (l) => getUiStatus(l.lockerStatus) === "active",
        ).length,
        inactive: lockersResponse.data.filter(
          (l) => getUiStatus(l.lockerStatus) === "inactive",
        ).length,
        under_maintenance: lockersResponse.data.filter(
          (l) => getUiStatus(l.lockerStatus) === "under_maintenance",
        ).length,
      }
    : { all: 0, active: 0, inactive: 0, under_maintenance: 0 }

  const containerPadding = isSidebarOpen
    ? "p-2 sm:p-2 md:p-3 lg:p-4"
    : "p-2 sm:p-3 md:p-4 lg:p-6"

  return (
    <div className={`flex min-h-screen w-full flex-col ${containerPadding}`}>
      <LockerFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        uniqueLocations={uniqueLocations}
        statusCounts={statusCounts}
        locationCounts={locationCounts}
        isSidebarOpen={isSidebarOpen}
        lockersResponse={lockersResponse}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-48 flex-col items-center justify-center">
          <p className="text-center font-medium text-lg">Loading lockers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-center font-medium text-red-600">
            Error loading lockers
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Locker Grid */}
      {!isLoading && !error && lockersResponse?.data && (
        <>
          {lockersResponse.data.length > 0 ? (
            <motion.div
              className={getGridLayoutClass(
                isSidebarOpen,
                lockersResponse.data.length,
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {lockersResponse.data.map((locker, index) => (
                <LockerCard
                  key={`locker-${locker.id}-${index}`}
                  locker={{
                    id: Number(locker.id),
                    name: locker.lockerName,
                    location: locker.lockerLocation,
                    status: getUiStatus(locker.lockerStatus),
                  }}
                  index={index}
                  isSelected={selectedLocker === locker.id}
                  onSelect={() =>
                    setSelectedLocker(
                      selectedLocker === locker.id ? null : locker.id,
                    )
                  }
                  compact={isSidebarOpen}
                  id={locker.id}
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-3 sm:p-4">
              <p className="mb-2 text-center font-medium text-lg sm:text-xl">
                No lockers found
              </p>
              <p className="text-center text-muted-foreground text-xs sm:text-sm">
                Try changing your search or filter criteria
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setLocationFilter("all")
                  setPage(1)
                }}
              >
                Reset filters
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          {lockersResponse.meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!lockersResponse.meta.hasPrevPage}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-2">
                Page {lockersResponse.meta.page} of{" "}
                {lockersResponse.meta.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!lockersResponse.meta.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
