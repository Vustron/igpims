"use client"

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdowns"
import {
  X,
  Search,
  Filter,
  ArrowUpDown,
  PlusCircleIcon,
  SlidersHorizontal,
} from "lucide-react"
import { IgpCard } from "@/features/other-igps/igp-card"
import { Separator } from "@/components/ui/separators"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"
import { Input } from "@/components/ui/inputs"

import { motion, AnimatePresence } from "framer-motion"

import { useDialog } from "@/hooks/use-dialog"
import { useState } from "react"

import type { IgpCardProps } from "@/features/other-igps/igp-card"

type SortOption =
  | "name-asc"
  | "name-desc"
  | "revenue-high"
  | "revenue-low"
  | "sold-high"
  | "sold-low"

export const OtherIgpsClient = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [selectedIconTypes, setSelectedIconTypes] = useState<string[]>([])
  const { onOpen } = useDialog()

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
      name: "Artisan Coffee Beans",
      description:
        "Premium locally-sourced coffee beans from Davao highlands, roasted and packaged by the Agriculture department.",
      type: "temporary",
      iconType: "coffee",
      totalSold: 512,
      revenue: 89600.0,
    },
    {
      id: "igp-5",
      name: "Handcrafted Notebooks",
      description:
        "Eco-friendly notebooks made with recycled paper and traditional binding techniques by the Fine Arts students.",
      type: "permanent",
      iconType: "book",
      totalSold: 743,
      revenue: 59440.0,
    },
    {
      id: "igp-6",
      name: "Festival Souvenirs",
      description:
        "Commemorative items celebrating Davao's annual festivals, designed and produced by DNSC's creative arts program.",
      type: "temporary",
      iconType: "store",
      totalSold: 928,
      revenue: 111360.0,
    },
    {
      id: "igp-7",
      name: "Bakery Products",
      description:
        "Freshly baked breads, pastries, and cakes produced by the Culinary Arts department using traditional recipes.",
      type: "permanent",
      iconType: "bakery",
      totalSold: 3578,
      revenue: 178900.0,
    },
    {
      id: "igp-8",
      name: "Tech Repair Services",
      description:
        "Computer and mobile device repair services offered by IT students for the campus community at affordable rates.",
      type: "permanent",
      iconType: "tech",
      totalSold: 412,
      revenue: 82400.0,
    },
    {
      id: "igp-9",
      name: "Print & Design Shop",
      description:
        "Professional printing, binding, and design services for academic and promotional materials run by multimedia arts students.",
      type: "permanent",
      iconType: "printing",
      totalSold: 2189,
      revenue: 131340.0,
    },
  ]

  // Get all unique icon types for filter options
  const allIconTypes = Array.from(new Set(demoIgps.map((igp) => igp.iconType)))

  // Filter IGPs based on search, type and icon type
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

  // Sort the filtered IGPs
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

  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  // Toggle icon type selection
  const toggleIconType = (iconType: string) => {
    setSelectedIconTypes((prev) =>
      prev.includes(iconType)
        ? prev.filter((t) => t !== iconType)
        : [...prev, iconType],
    )
  }

  // Get display name for icon types
  const getIconTypeDisplayName = (iconType: string) => {
    return iconType.charAt(0).toUpperCase() + iconType.slice(1)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedIconTypes([])
    setSortOption("name-asc")
  }

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm !== "" ||
    selectedTypes.length > 0 ||
    selectedIconTypes.length > 0 ||
    sortOption !== "name-asc"

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search IGPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8 pl-8"
          />
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm("")}
              className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${selectedTypes.length > 0 ? "border-primary/30 bg-primary/10 text-primary" : ""}`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Type</span>
                {selectedTypes.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                  >
                    {selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs">
                IGP Types
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("permanent")}
                onCheckedChange={() => toggleType("permanent")}
                className="text-xs"
              >
                Permanent
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("temporary")}
                onCheckedChange={() => toggleType("temporary")}
                className="text-xs"
              >
                Temporary
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${selectedIconTypes.length > 0 ? "border-primary/30 bg-primary/10 text-primary" : ""}`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Category</span>
                {selectedIconTypes.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                  >
                    {selectedIconTypes.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-80 w-48 overflow-y-auto"
            >
              <DropdownMenuLabel className="text-xs">
                Categories
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allIconTypes.map((iconType) => (
                <DropdownMenuCheckboxItem
                  key={iconType}
                  checked={selectedIconTypes.includes(iconType || "")}
                  onCheckedChange={() => toggleIconType(iconType || "")}
                  className="text-xs"
                >
                  {getIconTypeDisplayName(iconType || "")}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${sortOption !== "name-asc" ? "border-primary/30 bg-primary/10 text-primary" : ""}`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs">
                Sort Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortOption === "name-asc"}
                onCheckedChange={() =>
                  sortOption !== "name-asc" && setSortOption("name-asc")
                }
                className="text-xs"
              >
                Name (A to Z)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOption === "name-desc"}
                onCheckedChange={() =>
                  sortOption !== "name-desc" && setSortOption("name-desc")
                }
                className="text-xs"
              >
                Name (Z to A)
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortOption === "revenue-high"}
                onCheckedChange={() =>
                  sortOption !== "revenue-high" && setSortOption("revenue-high")
                }
                className="text-xs"
              >
                Revenue (Highest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOption === "revenue-low"}
                onCheckedChange={() =>
                  sortOption !== "revenue-low" && setSortOption("revenue-low")
                }
                className="text-xs"
              >
                Revenue (Lowest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortOption === "sold-high"}
                onCheckedChange={() =>
                  sortOption !== "sold-high" && setSortOption("sold-high")
                }
                className="text-xs"
              >
                Items Sold (Highest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOption === "sold-low"}
                onCheckedChange={() =>
                  sortOption !== "sold-low" && setSortOption("sold-low")
                }
                className="text-xs"
              >
                Items Sold (Lowest first)
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reset button - only visible when filters are active */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1 ${sortOption !== "name-asc" ? "border-primary/30 bg-primary/10 text-primary" : ""}`}
            onClick={() => onOpen("createIgp")}
          >
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span>Add Igp</span>
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            {searchTerm && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">Search: {searchTerm}</span>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}

            {selectedTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs capitalize">{type}</span>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => toggleType(type)}
                />
              </Badge>
            ))}

            {selectedIconTypes.map((iconType) => (
              <Badge
                key={iconType}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">
                  {getIconTypeDisplayName(iconType)}
                </span>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => toggleIconType(iconType)}
                />
              </Badge>
            ))}

            {sortOption !== "name-asc" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">
                  {sortOption === "name-desc" && "Name (Z to A)"}
                  {sortOption === "revenue-high" && "Revenue (Highest first)"}
                  {sortOption === "revenue-low" && "Revenue (Lowest first)"}
                  {sortOption === "sold-high" && "Items Sold (Highest first)"}
                  {sortOption === "sold-low" && "Items Sold (Lowest first)"}
                </span>
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => setSortOption("name-asc")}
                />
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
