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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import {
  X,
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  PlusCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"
import { Input } from "@/components/ui/inputs"

import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { useDialog } from "@/hooks/use-dialog"
import { cn } from "@/utils/cn"

import { motion, AnimatePresence } from "framer-motion"

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "revenue-high"
  | "revenue-low"
  | "sold-high"
  | "sold-low"

export interface IgpFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedTypes: string[]
  toggleType: (type: string) => void
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  selectedIconTypes: string[]
  toggleIconType: (iconType: string) => void
  resetFilters: () => void
  hasActiveFilters: boolean
  allIconTypes: string[]
}

export function IgpFilters({
  searchTerm,
  setSearchTerm,
  selectedTypes,
  toggleType,
  sortOption,
  setSortOption,
  selectedIconTypes,
  toggleIconType,
  resetFilters,
  hasActiveFilters,
  allIconTypes,
}: IgpFiltersProps) {
  const { onOpen } = useDialog()
  const { requests } = useProjectRequestStore()

  // Check if there are any active projects (not completed or rejected)
  const hasActiveProjects = requests.some(
    (request) =>
      request.status !== "completed" && request.status !== "rejected",
  )

  // Find the latest active project for tooltip message
  const latestActiveProject = requests
    .filter(
      (request) =>
        request.status !== "completed" && request.status !== "rejected",
    )
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    )[0]

  const getIconTypeDisplayName = (iconType: string) => {
    return iconType.charAt(0).toUpperCase() + iconType.slice(1)
  }

  return (
    <>
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
              className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
              variant="ghost"
            >
              <X className="size-4" />
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
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("maintenance")}
                onCheckedChange={() => toggleType("maintenance")}
                className="text-xs"
              >
                Maintenance
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

          {/* New IGP Proposal Button with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => !hasActiveProjects && onOpen("createIgp")}
                size="sm"
                className={cn(
                  "flex items-center gap-1.5",
                  hasActiveProjects && "cursor-not-allowed opacity-50",
                )}
                disabled={hasActiveProjects}
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span>New IGP Proposal</span>
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side="bottom"
              align="center"
              className={cn(
                hasActiveProjects && latestActiveProject
                  ? "max-w-xs bg-amber-800 text-white"
                  : "",
              )}
            >
              {hasActiveProjects && latestActiveProject ? (
                <div className="flex items-start gap-2">
                  <span className="text-sm">⚠️</span>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Active project exists</p>
                    <p className="text-amber-100 text-xs">
                      Complete "{latestActiveProject.projectTitle}" (
                      {latestActiveProject.id}) first
                    </p>
                  </div>
                </div>
              ) : (
                <span>Create a new IGP proposal</span>
              )}
            </TooltipContent>
          </Tooltip>
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
    </>
  )
}
