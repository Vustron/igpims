"use client"

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/selects"
import { LockerCard } from "@/features/locker-rental/locker-card"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"
import { Input } from "@/components/ui/inputs"
import { Search, Filter } from "lucide-react"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import type { Locker } from "@/interfaces/locker"

export const lockerList: Locker[] = [
  {
    id: 1,
    name: "SM - 01",
    status: "active",
  },
  {
    id: 2,
    name: "SM - 02",
    status: "inactive",
  },
  {
    id: 3,
    name: "SM - 03",
    status: "under_maintenance",
  },
  {
    id: 4,
    name: "SM - 04",
    status: "active",
  },
]

export const LockerRentalClient = () => {
  const [data, setData] = useState<Locker[]>(lockerList)
  const [filteredData, setFilteredData] = useState<Locker[]>(lockerList)
  const [selectedLocker, setSelectedLocker] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (locker) =>
          locker.name.toLowerCase().includes(term) ||
          locker.id.toString().includes(term),
      )
    }

    setFilteredData(result)
  }, [data, searchTerm, statusFilter])

  useEffect(() => {
    setData(lockerList)
  }, [])

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "active":
        return "Available"
      case "inactive":
        return "In Use"
      case "under_maintenance":
        return "Maintenance"
      default:
        return "All"
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "inactive":
        return "bg-slate-500 hover:bg-slate-600"
      case "under_maintenance":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="mb-2 font-bold text-xl sm:text-2xl md:text-3xl">
          Locker Rental
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Browse and manage available lockers
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lockers..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lockers</SelectItem>
              <SelectItem value="active">Available</SelectItem>
              <SelectItem value="inactive">In Use</SelectItem>
              <SelectItem value="under_maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Badges */}
      <div className="mb-6 flex flex-wrap gap-2">
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
              className="ml-2 bg-white/20 hover:bg-white/30"
            >
              {statusCounts[status as keyof typeof statusCounts]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground text-sm">
          Showing {filteredData.length} of {data.length} lockers
        </p>
      </div>

      {/* Locker Grid */}
      {filteredData.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8">
          <p className="mb-2 text-center font-medium text-xl">
            No lockers found
          </p>
          <p className="text-center text-muted-foreground text-sm">
            Try changing your search or filter criteria
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
