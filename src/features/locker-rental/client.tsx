"use client"

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/selects"
import { getStatusColor, getStatusLabel } from "@/utils/get-percentage-color"
import { LockerCard } from "@/features/locker-rental/locker-card"
import { Search, PlusCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"
import { Input } from "@/components/ui/inputs"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import type { Locker } from "@/interfaces/locker"

export const lockerList: Locker[] = [
  {
    id: 1,
    name: "SM - 01",
    status: "active",
    location: "Academic Building - 1st Floor (Left)",
  },
  {
    id: 2,
    name: "SM - 02",
    status: "inactive",
    location: "Academic Building - 1st Floor (Left)",
  },
  {
    id: 3,
    name: "SM - 03",
    status: "under_maintenance",
    location: "Academic Building - 1st Floor (Left)",
  },
  {
    id: 4,
    name: "SM - 04",
    status: "active",
    location: "Academic Building - 1st Floor (Right)",
  },
  {
    id: 5,
    name: "SM - 05",
    status: "active",
    location: "IC - 1st Floor (Right)",
  },
  {
    id: 6,
    name: "SM - 06",
    status: "active",
    location: "Academic Building - 2nd Floor (Left)",
  },
  {
    id: 7,
    name: "SM - 07",
    status: "active",
    location: "Academic Building - 2nd Floor (Left)",
  },
  {
    id: 8,
    name: "SM - 08",
    status: "active",
    location: "Academic Building - 2nd Floor (Right)",
  },
  {
    id: 9,
    name: "SM - 09",
    status: "active",
    location: "Academic Building - 2nd Floor (Right)",
  },
  {
    id: 10,
    name: "SM - 10",
    status: "active",
    location: "Academic Building - 2nd Floor (Right)",
  },
]

export const LockerRentalClient = () => {
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

  return (
    <div className="flex min-h-screen w-full flex-col p-2 sm:p-3 md:p-4 lg:p-6">
      {/* Filters Section */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center md:mb-4">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lockers..."
            className="h-9 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:gap-2">
          <div className="flex items-center gap-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <p className="text-xs">All Statuses</p>
                </SelectItem>
                <SelectItem value="active">
                  <p className="text-xs">Available</p>
                </SelectItem>
                <SelectItem value="inactive">
                  <p className="text-xs">In Use</p>
                </SelectItem>
                <SelectItem value="under_maintenance">
                  <p className="text-xs">Maintenance</p>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-9 sm:w-[140px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent className="w-[180px]">
                <SelectItem value="all">
                  <p className="text-xs">All Locations</p>
                </SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    <p className="text-xs">{location}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button>
            <span className="text-xs">Add Locker</span>
            <PlusCircleIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="mb-3 flex flex-col gap-2 md:mb-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-1">
          <p className="mr-1 flex items-center font-medium text-muted-foreground text-xs">
            Status:
          </p>
          {["all", "active", "inactive", "under_maintenance"].map((status) => (
            <Button
              key={status}
              onClick={() => setStatusFilter(status)}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              className={`flex items-center text-xs sm:text-sm ${
                statusFilter === status ? getStatusColor(status) : ""
              }`}
            >
              {getStatusLabel(status)}
              <Badge
                variant="secondary"
                className="ml-1 bg-white/20 text-xs hover:bg-white/30"
              >
                {statusCounts[status as keyof typeof statusCounts]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Location Badges */}
        <div className="flex flex-wrap gap-2">
          <p className="mr-1 flex items-center font-medium text-muted-foreground text-xs">
            Location:
          </p>
          <Button
            onClick={() => setLocationFilter("all")}
            variant={locationFilter === "all" ? "default" : "outline"}
            size="sm"
            className={`flex items-center text-xs sm:text-sm ${
              locationFilter === "all" ? "bg-blue-500 hover:bg-blue-600" : ""
            }`}
          >
            All Locations
            <Badge
              variant="secondary"
              className="ml-2 bg-white/20 hover:bg-white/30"
            >
              {locationCounts.all}
            </Badge>
          </Button>

          {uniqueLocations.map((location) => (
            <Button
              key={location}
              onClick={() => setLocationFilter(location)}
              variant={locationFilter === location ? "default" : "outline"}
              size="sm"
              className={`flex items-center text-xs sm:text-sm ${
                locationFilter === location
                  ? "bg-purple-500 hover:bg-purple-600"
                  : ""
              }`}
            >
              {location}
              <Badge
                variant="secondary"
                className="ml-2 bg-white/20 hover:bg-white/30"
              >
                {locationCounts[location as keyof typeof locationCounts]}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground text-xs sm:text-sm">
          Showing {filteredData.length} of {data.length} lockers
        </p>
      </div>

      {/* Locker Grid */}
      {filteredData.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 xxs:grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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
