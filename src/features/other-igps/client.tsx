"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/buttons"
import { Separator } from "@/components/ui/separators"
import { IgpCard, IgpCardProps } from "./igp-card"
import { IgpFilters, SortOption } from "./igp-filters"

export const OtherIgpsClient = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [selectedIconTypes, setSelectedIconTypes] = useState<string[]>([])

  const demoIgps: IgpCardProps[] = [
    {
      id: "igp-1",
      name: "Kalibulong T-Shirts",
      description:
        "Limited edition t-shirts featuring original artwork by local artists celebrating Davao's indigenous heritage.",
      type: "permanent",
      iconType: "shirt",
      totalSold: 2456,
      revenue: 345750.5,
    },
    {
      id: "igp-2",
      name: "Eco Tote-bags",
      description:
        "Sustainable canvas bags handcrafted by DNSC students using upcycled materials with ethnic-inspired designs.",
      type: "temporary",
      iconType: "package",
      totalSold: 834,
      revenue: 125680.75,
    },
    {
      id: "igp-3",
      name: "DNSC Campus Merchandise",
      description:
        "Official college apparel featuring the DNSC logo and colors, perfect for students, alumni and supporters.",
      type: "permanent",
      iconType: "shirt",
      totalSold: 1356,
      revenue: 203450.0,
    },
    {
      id: "igp-4",
      name: "Button Pins",
      description:
        "Button pins with unique designs created by the Fine Arts students, perfect for personalizing bags and jackets.",
      type: "temporary",
      iconType: "pin",
      totalSold: 512,
      revenue: 89600.0,
    },
    {
      id: "igp-5",
      name: "Raffle Tickets",
      description:
        "Raffle tickets for various events organized by the student council, with proceeds going to student scholarships.",
      type: "maintenance",
      iconType: "ticket",
      totalSold: 743,
      revenue: 59440.0,
      maintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    {
      id: "igp-6",
      name: "Customized ID Lace",
      description:
        "Personalized ID laces with unique designs and colors, made by the students of the Arts and Design department.",
      type: "maintenance",
      iconType: "store",
      totalSold: 928,
      revenue: 111360.0,
      maintenanceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  ]

  const allIconTypes = Array.from(
    new Set(demoIgps.map((igp) => igp.iconType || "")),
  ).filter(Boolean) as string[]

  const filteredIgps = demoIgps.filter((igp) => {
    const matchesSearch =
      igp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      igp.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(igp.type)

    const matchesIconType =
      selectedIconTypes.length === 0 ||
      selectedIconTypes.includes(igp.iconType || "")

    return matchesSearch && matchesType && matchesIconType
  })

  const sortedIgps = [...filteredIgps].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "revenue-high":
        return b.revenue - a.revenue
      case "revenue-low":
        return a.revenue - b.revenue
      case "sold-high":
        return b.totalSold - a.totalSold
      case "sold-low":
        return a.totalSold - b.totalSold
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

  return (
    <div className="mt-2 space-y-6">
      {/* Filters component */}
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
      />

      {/* Results count and separator */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="font-medium text-foreground">
            {sortedIgps.length}
          </span>{" "}
          IGP{sortedIgps.length !== 1 ? "s" : ""}
          {demoIgps.length !== sortedIgps.length && (
            <>
              {" "}
              out of{" "}
              <span className="font-medium text-foreground">
                {demoIgps.length}
              </span>{" "}
              total
            </>
          )}
        </p>
        <Separator orientation="vertical" className="h-4" />
      </div>

      {/* IGP Cards Grid */}
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
                <IgpCard {...igp} />
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
