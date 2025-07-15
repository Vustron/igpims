"use client"

import {
  IgpWithProjectLeadData,
  useFindManyIgp,
} from "@/backend/actions/igp/find-many"
import { Button } from "@/components/ui/buttons"
import { Separator } from "@/components/ui/separators"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { IgpCard, IgpCardProps } from "./igp-card"
import { IgpFilters, SortOption } from "./igp-filters"

export const OtherIgpsClient = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [selectedIconTypes, setSelectedIconTypes] = useState<string[]>([])

  const {
    data: igpsResponse,
    isLoading,
    error,
  } = useFindManyIgp({
    search: searchTerm,
    igpType: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
    sort: mapSortOptionToApiSort(sortOption),
  })

  const allIconTypes = Array.from(
    new Set(igpsResponse?.data.map((igp) => igp.iconType || "")),
  ).filter(Boolean) as string[]

  const filteredIgps = (igpsResponse?.data || []).filter((igp) => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(igp.igpType)

    const matchesIconType =
      selectedIconTypes.length === 0 ||
      selectedIconTypes.includes(igp.iconType || "")

    return matchesType && matchesIconType
  })

  const sortedIgps = [...filteredIgps].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return (a.igpName ?? "").localeCompare(b.igpName ?? "")
      case "name-desc":
        return (b.igpName ?? "").localeCompare(a.igpName ?? "")
      case "revenue-high":
        return (b.igpRevenue || 0) - (a.igpRevenue || 0)
      case "revenue-low":
        return (a.igpRevenue || 0) - (b.igpRevenue || 0)
      case "sold-high":
        return (b.totalSold || 0) - (a.totalSold || 0)
      case "sold-low":
        return (a.totalSold || 0) - (b.totalSold || 0)
      default:
        return 0
    }
  })

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const toggleIconType = (iconType: string) => {
    setSelectedIconTypes((prev) =>
      prev.includes(iconType)
        ? prev.filter((t) => t !== iconType)
        : [...prev, iconType],
    )
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedIconTypes([])
    setSortOption("name-asc")
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedTypes.length > 0 ||
    selectedIconTypes.length > 0 ||
    sortOption !== "name-asc"

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading IGPs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-center font-medium text-red-600">
          Error loading IGPs
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  const mapToCardProps = (igp: IgpWithProjectLeadData): IgpCardProps => ({
    id: igp.id,
    name: igp.igpName || "Unnamed IGP",
    description: igp.igpDescription || "No description provided",
    type: igp.igpType as "permanent" | "temporary" | "maintenance",
    iconType: igp.iconType as any,
    totalSold: igp.totalSold || 0,
    revenue: igp.igpRevenue || 0,
    maintenanceDate:
      igp.igpType === "maintenance" ? (igp.igpEndDate ?? undefined) : undefined,
    status: igp.status,
  })

  return (
    <div className="mt-2 space-y-6">
      <IgpFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTypes={selectedTypes}
        toggleType={toggleType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        selectedIconTypes={selectedIconTypes}
        toggleIconType={toggleIconType}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        allIconTypes={allIconTypes}
        requests={igpsResponse?.data || []}
      />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="font-medium text-foreground">
            {sortedIgps.length}
          </span>{" "}
          IGP{sortedIgps.length !== 1 ? "s" : ""}
          {igpsResponse?.meta.totalItems !== sortedIgps.length && (
            <>
              {" "}
              out of{" "}
              <span className="font-medium text-foreground">
                {igpsResponse?.meta.totalItems}
              </span>{" "}
              total
            </>
          )}
        </p>
        <Separator orientation="vertical" className="h-4" />
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {sortedIgps.length > 0 ? (
            sortedIgps.map((igp) => (
              <motion.div
                key={igp.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <IgpCard {...mapToCardProps(igp)} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-12 text-center"
            >
              <p className="text-muted-foreground">
                No IGPs found matching your filters.
              </p>
              <Button variant="link" onClick={resetFilters} className="mt-2">
                Reset all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function mapSortOptionToApiSort(sortOption: SortOption): string | undefined {
  switch (sortOption) {
    case "name-asc":
      return "igpName:asc"
    case "name-desc":
      return "igpName:desc"
    case "revenue-high":
      return "igpRevenue:desc"
    case "revenue-low":
      return "igpRevenue:asc"
    case "sold-high":
      return "totalSold:desc"
    case "sold-low":
      return "totalSold:asc"
    default:
      return undefined
  }
}
