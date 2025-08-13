"use client"

import { useFindManyLockers } from "@/backend/actions/locker/find-many"
import { Button } from "@/components/ui/buttons"
import { motion } from "framer-motion"
import { useState } from "react"
import { LockerCard } from "./locker-card"
import { LockerFilter } from "./locker-filter"
import { LockersSkeleton } from "./lockers-skeleton"

export const LockersClient = ({ isSidebarOpen = false }) => {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [clusterFilter, setClusterFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [limit] = useState(50)

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
    cluster: clusterFilter !== "all" ? clusterFilter : undefined,
    search: searchTerm || undefined,
  })

  const groupedLockers =
    lockersResponse?.data?.reduce(
      (acc, locker) => {
        const clusterKey = locker.clusterName || "Unassigned"
        if (!acc[clusterKey]) {
          acc[clusterKey] = {
            clusterId: locker.clusterId,
            lockers: [],
          }
        }
        acc[clusterKey].lockers.push(locker)
        return acc
      },
      {} as Record<
        string,
        { clusterId: string; lockers: typeof lockersResponse.data }
      >,
    ) || {}

  const uniqueClusters = lockersResponse?.data
    ? Array.from(
        new Set(
          lockersResponse.data
            .map((locker) => locker.clusterName)
            .filter(Boolean),
        ),
      )
    : []

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

  const clusterCounts = lockersResponse?.data
    ? {
        all: lockersResponse.data.length,
        ...Object.fromEntries(
          uniqueClusters.map((cluster) => [
            cluster,
            lockersResponse.data.filter((l) => l.clusterName === cluster)
              .length,
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

  if (isLoading) {
    return <LockersSkeleton isSidebarOpen={isSidebarOpen} />
  }

  return (
    <div
      className={`-mt-12 flex min-h-screen w-full flex-col ${containerPadding}`}
    >
      <LockerFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        clusterFilter={clusterFilter}
        setClusterFilter={setClusterFilter}
        uniqueLocations={uniqueLocations}
        uniqueClusters={uniqueClusters}
        statusCounts={statusCounts}
        locationCounts={locationCounts}
        clusterCounts={clusterCounts}
        isSidebarOpen={isSidebarOpen}
        lockersResponse={lockersResponse}
      />

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

      {!isLoading && !error && lockersResponse?.data && (
        <>
          {Object.keys(groupedLockers).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedLockers)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([clusterName, { clusterId, lockers }], clusterIndex) => (
                  <motion.div
                    key={clusterId || clusterName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: clusterIndex * 0.1 }}
                    className="bg-card rounded-xl border shadow-sm p-6"
                  >
                    <div className="mb-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">
                            {clusterName}
                          </h2>
                          <p className="text-muted-foreground text-sm">
                            Cluster ID: {clusterId} • {lockers.length} lockers
                          </p>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Available:{" "}
                            {
                              lockers.filter(
                                (l) => getUiStatus(l.lockerStatus) === "active",
                              ).length
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            Occupied:{" "}
                            {
                              lockers.filter(
                                (l) =>
                                  getUiStatus(l.lockerStatus) === "inactive",
                              ).length
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            Maintenance:{" "}
                            {
                              lockers.filter(
                                (l) =>
                                  getUiStatus(l.lockerStatus) ===
                                  "under_maintenance",
                              ).length
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`grid gap-4 ${
                        isSidebarOpen
                          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
                      }`}
                    >
                      {lockers
                        .sort((a, b) =>
                          a.lockerName.localeCompare(b.lockerName),
                        )
                        .map((locker, lockerIndex) => (
                          <LockerCard
                            key={`${clusterId}-${locker.id}`}
                            locker={{
                              ...locker,
                              lockerType: locker.lockerType as
                                | "small"
                                | "medium"
                                | "large"
                                | "extra-large",
                            }}
                            index={clusterIndex * 100 + lockerIndex}
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
                    </div>
                  </motion.div>
                ))}
            </div>
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
                  setClusterFilter("all")
                  setPage(1)
                }}
              >
                Reset filters
              </Button>
            </div>
          )}

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
