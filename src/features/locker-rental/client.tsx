"use client"

import {
  LockerFilter,
  getGridLayoutClass,
} from "@/features/locker-rental/locker-filter"
import { LockerCard } from "@/features/locker-rental/locker-card"
import { Button } from "@/components/ui/buttons"

import { useEffect, useState } from "react"

import { lockerList } from "@/interfaces/locker"
import { motion } from "framer-motion"

import type { Locker } from "@/interfaces/locker"

export const LockerRentalClient = ({ isSidebarOpen = false }) => {
  const [data, setData] = useState<Locker[]>(lockerList)
  const [filteredData, setFilteredData] = useState<Locker[]>(lockerList)
  const [selectedLocker, setSelectedLocker] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")

  const uniqueLocations = Array.from(
    new Set(
      lockerList.map((locker) => {
        const mainLocation =
          locker.location.split("-")[0]?.trim() || locker.location.trim()
        return mainLocation
      }),
    ),
  )

  const locationCounts = {
    all: lockerList.length,
    ...Object.fromEntries(
      uniqueLocations.map((location) => [
        location,
        lockerList.filter((l) => l.location.includes(location)).length,
      ]),
    ),
  }

  const statusCounts = {
    all: lockerList.length,
    active: lockerList.filter((l) => l.status === "active").length,
    inactive: lockerList.filter((l) => l.status === "inactive").length,
    under_maintenance: lockerList.filter(
      (l) => l.status === "under_maintenance",
    ).length,
  }

  useEffect(() => {
    let result = [...data]

    if (statusFilter !== "all") {
      result = result.filter((locker) => locker.status === statusFilter)
    }

    if (locationFilter !== "all") {
      result = result.filter((locker) =>
        locker.location.includes(locationFilter),
      )
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (locker) =>
          locker.name.toLowerCase().includes(term) ||
          locker.id.toString().includes(term) ||
          locker.location.toLowerCase().includes(term),
      )
    }

    setFilteredData(result)
  }, [data, searchTerm, statusFilter, locationFilter])

  useEffect(() => {
    setData(lockerList)
  }, [])

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
      />

      {/* Results */}
      <div className="mb-3">
        <p className="text-muted-foreground text-xs sm:text-sm">
          Showing {filteredData.length} of {data.length} lockers
        </p>
      </div>

      {/* Locker Grid */}
      {filteredData.length > 0 ? (
        <motion.div
          className={getGridLayoutClass(isSidebarOpen, filteredData.length)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredData.map((locker, index) => (
            <LockerCard
              key={locker.id}
              locker={locker}
              index={index}
              isSelected={selectedLocker === locker.id}
              onSelect={() =>
                setSelectedLocker(
                  selectedLocker === locker.id ? null : locker.id,
                )
              }
              compact={isSidebarOpen}
              id={locker.id.toString()}
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
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
