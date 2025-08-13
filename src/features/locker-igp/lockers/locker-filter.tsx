"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordions"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/inputs"
import { Label } from "@/components/ui/labels"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"
import { Separator } from "@/components/ui/separators"
import { useDialog } from "@/hooks/use-dialog"
import { getStatusColor, getStatusLabel } from "@/utils/get-percentage-color"
import { CheckCircle2, Filter, PlusCircleIcon, Search, X } from "lucide-react"

interface LockerFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  locationFilter: string
  setLocationFilter: (location: string) => void
  clusterFilter: string
  setClusterFilter: (cluster: string) => void
  uniqueLocations: string[]
  uniqueClusters: string[]
  statusCounts: Record<string, number>
  locationCounts: Record<string, number>
  clusterCounts: Record<string, number>
  isSidebarOpen: boolean
  lockersResponse?: {
    data: any[]
    meta: {
      totalItems: number
    }
  }
}

export const LockerFilter: React.FC<LockerFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  clusterFilter,
  setClusterFilter,
  uniqueLocations,
  uniqueClusters,
  statusCounts,
  // locationCounts,
  // clusterCounts,
  isSidebarOpen,
  lockersResponse,
}) => {
  const showFilters =
    searchTerm ||
    statusFilter !== "all" ||
    locationFilter !== "all" ||
    clusterFilter !== "all"
  const { onOpen } = useDialog()

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setLocationFilter("all")
    setClusterFilter("all")
  }

  return (
    <div className="mb-1 space-y-4 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 font-medium text-muted-foreground text-xs"
            >
              <X className="mr-1 size-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar with advanced options */}
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-grow">
            <div className="-translate-y-1/2 absolute top-1/2 left-3 flex items-center">
              <Search className="size-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search by name, ID, location, or cluster..." // Updated placeholder
              className="h-10 w-full pr-16 pl-9 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("Searching for:", searchTerm)
                }
              }}
            />
            <div className="-translate-y-1/2 absolute top-1/2 right-2 flex items-center gap-1">
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="size-3.5 text-muted-foreground" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-primary/10"
              >
                <Filter className="size-3.5 text-muted-foreground" />
                <span className="sr-only">Advanced search</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-1.5 whitespace-nowrap px-3"
              onClick={() => onOpen("createLocker")}
            >
              <PlusCircleIcon className="size-4" />
              <span className="text-xs">Add Locker</span>
            </Button>

            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-10 gap-1.5 border-dashed px-3 text-xs"
              >
                <X className="size-3.5" />
                <span>Clear Filters</span>
              </Button>
            )}
          </div>
        </div>

        {/* Search suggestions */}
        {searchTerm && (
          <div className="mt-1 rounded-md border bg-card shadow-sm">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-muted-foreground text-xs">
                  Suggestions
                </p>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  View All
                </Button>
              </div>
              <ul className="mt-1 space-y-1">
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start px-2"
                    onClick={() => setSearchTerm("SM - 01")}
                  >
                    <span className="font-medium">SM - 01</span>
                    <Badge className="ml-2 bg-emerald-500 text-[8px]">
                      Active
                    </Badge>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start px-2"
                    onClick={() => setSearchTerm("SM - 02")}
                  >
                    <span className="font-medium">SM - 02</span>
                    <Badge className="ml-2 bg-slate-500 text-[8px]">
                      Inactive
                    </Badge>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start px-2"
                    onClick={() => setSearchTerm("LG - 01")}
                  >
                    <span className="font-medium">LG - 01</span>
                    <Badge className="ml-2 bg-emerald-500 text-[8px]">
                      Active
                    </Badge>
                  </Button>
                </li>
              </ul>
            </div>
            <div className="border-t bg-muted/30 px-2 py-1.5">
              <p className="text-muted-foreground text-xs">
                Press{" "}
                <kbd className="rounded border bg-muted px-1.5 text-[10px]">
                  Enter
                </kbd>{" "}
                to search
              </p>
            </div>
          </div>
        )}

        {/* Active filters chips - Updated to include cluster */}
        {showFilters && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {searchTerm && (
              <div className="flex items-center rounded-full border bg-background px-2.5 py-1 text-xs">
                <span className="mr-1 text-muted-foreground">Search:</span>
                <span className="font-medium">{searchTerm}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="size-2.5" />
                  <span className="sr-only">Clear search</span>
                </Button>
              </div>
            )}

            {statusFilter !== "all" && (
              <div
                className={`flex items-center rounded-full px-2.5 py-1 text-white text-xs ${getStatusColor(statusFilter)}`}
              >
                <span className="mr-1">Status:</span>
                <span className="font-medium">
                  {getStatusLabel(statusFilter)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={() => setStatusFilter("all")}
                >
                  <X className="size-2.5" />
                  <span className="sr-only">Clear status</span>
                </Button>
              </div>
            )}

            {locationFilter !== "all" && (
              <div className="flex items-center rounded-full bg-purple-500 px-2.5 py-1 text-white text-xs">
                <span className="mr-1">Location:</span>
                <span className="font-medium">{locationFilter}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={() => setLocationFilter("all")}
                >
                  <X className="size-2.5" />
                  <span className="sr-only">Clear location</span>
                </Button>
              </div>
            )}

            {/* Added cluster filter chip */}
            {clusterFilter !== "all" && (
              <div className="flex items-center rounded-full bg-blue-500 px-2.5 py-1 text-white text-xs">
                <span className="mr-1">Cluster:</span>
                <span className="font-medium">{clusterFilter}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={() => setClusterFilter("all")}
                >
                  <X className="size-2.5" />
                  <span className="sr-only">Clear cluster</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters on Mobile: Accordion for smaller screens */}
      <div className="block sm:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters">
            <AccordionTrigger className="py-2 text-sm">
              <div className="flex items-center gap-2">
                <Filter className="size-3.5" />
                <span>Filter Options</span>
                {showFilters && (
                  <Badge className="ml-1 h-5 bg-primary px-1 text-[10px]">
                    {/* Updated filter count to include cluster */}
                    {
                      Object.values([
                        statusFilter !== "all" ? 1 : 0,
                        locationFilter !== "all" ? 1 : 0,
                        clusterFilter !== "all" ? 1 : 0,
                        searchTerm ? 1 : 0,
                      ]).filter(Boolean).length
                    }
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {/* Status Select */}
                <div className="space-y-1">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Status
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Available</SelectItem>
                      <SelectItem value="inactive">In Use</SelectItem>
                      <SelectItem value="under_maintenance">
                        Maintenance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Select */}
                <div className="space-y-1">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Location
                  </Label>
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {uniqueLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Added Cluster Select */}
                <div className="space-y-1">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Cluster
                  </Label>
                  <Select
                    value={clusterFilter}
                    onValueChange={setClusterFilter}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Filter by cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clusters</SelectItem>
                      {uniqueClusters.map((cluster) => (
                        <SelectItem key={cluster} value={cluster}>
                          {cluster}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter Pills */}
                <div className="space-y-1">
                  <Label className="font-medium text-muted-foreground text-xs">
                    Quick Filters
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {["all", "active", "inactive", "under_maintenance"].map(
                      (status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={
                            statusFilter === status ? "default" : "outline"
                          }
                          onClick={() => setStatusFilter(status)}
                          className={`rounded-full ${statusFilter === status ? getStatusColor(status) : ""}`}
                        >
                          <span className="text-[10px]">
                            {getStatusLabel(status)}
                          </span>
                          <Badge
                            variant="secondary"
                            className="ml-1 flex size-4 items-center justify-center rounded-full bg-white/20 p-0 text-[9px]"
                          >
                            {statusCounts[status as keyof typeof statusCounts]}
                          </Badge>
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Filters on Desktop: Horizontal layout - Updated to include cluster */}
      <div className="hidden sm:block">
        <div
          className={`grid gap-3 ${isSidebarOpen ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-4"}`}
        >
          {/* Status Select */}
          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
              <span>Filter by Status</span>
              {statusFilter !== "all" && (
                <Badge className="h-4 bg-primary px-1 text-[10px]">
                  <CheckCircle2 className="mr-0.5 size-2" />
                  Active
                </Badge>
              )}
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Available</SelectItem>
                <SelectItem value="inactive">In Use</SelectItem>
                <SelectItem value="under_maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Select */}
          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
              <span>Filter by Location</span>
              {locationFilter !== "all" && (
                <Badge className="h-4 bg-primary px-1 text-[10px]">
                  <CheckCircle2 className="mr-0.5 size-2" />
                  Active
                </Badge>
              )}
            </Label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Added Cluster Select */}
          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
              <span>Filter by Cluster</span>
              {clusterFilter !== "all" && (
                <Badge className="h-4 bg-primary px-1 text-[10px]">
                  <CheckCircle2 className="mr-0.5 size-2" />
                  Active
                </Badge>
              )}
            </Label>
            <Select value={clusterFilter} onValueChange={setClusterFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clusters</SelectItem>
                {uniqueClusters.map((cluster) => (
                  <SelectItem key={cluster} value={cluster}>
                    {cluster}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary - Updated to include cluster */}
          <div className="space-y-1">
            <Label className="font-medium text-muted-foreground text-xs">
              Active Filters
            </Label>
            <div className="flex h-8 items-center rounded-md border bg-muted/40 px-2">
              {showFilters ? (
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {searchTerm && (
                    <Badge
                      variant="outline"
                      className="bg-background px-1.5 text-[10px]"
                    >
                      Search: "
                      {searchTerm.length > 10
                        ? `${searchTerm.substring(0, 10)}...`
                        : searchTerm}
                      "
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge
                      className={`${getStatusColor(statusFilter)} px-1.5 text-[10px]`}
                    >
                      {getStatusLabel(statusFilter)}
                    </Badge>
                  )}
                  {locationFilter !== "all" && (
                    <Badge className="bg-purple-500 px-1.5 text-[10px]">
                      {locationFilter.length > 15
                        ? `${locationFilter.substring(0, 15)}...`
                        : locationFilter}
                    </Badge>
                  )}
                  {/* Added cluster filter badge */}
                  {clusterFilter !== "all" && (
                    <Badge className="bg-blue-500 px-1.5 text-[10px]">
                      {clusterFilter.length > 15
                        ? `${clusterFilter.substring(0, 15)}...`
                        : clusterFilter}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground text-xs">
                  No active filters
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Pills (Desktop only) */}
      <div className="hidden sm:block">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-muted-foreground text-xs">
            Quick Status:
          </span>
          {["all", "active", "inactive", "under_maintenance"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className={`h-7 rounded-md ${statusFilter === status ? getStatusColor(status) : ""}`}
            >
              <span className="text-[10px]">{getStatusLabel(status)}</span>
              <Badge
                variant="secondary"
                className="ml-1 h-4 bg-white/20 px-1 text-[9px]"
              >
                {statusCounts[status as keyof typeof statusCounts]}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Results Counter - Updated to include cluster filter count */}
      <div className="pt-1">
        <Separator className="mb-2" />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Showing{" "}
            <span className="font-medium text-foreground">
              {lockersResponse?.data.length || 0} of{" "}
              {lockersResponse?.meta.totalItems || 0}
            </span>{" "}
            lockers
          </p>
          {showFilters && (
            <p className="text-muted-foreground text-xs">
              <span className="font-medium text-foreground">
                {/* Updated active filters count to include cluster */}
                {
                  Object.values([
                    statusFilter !== "all" ? 1 : 0,
                    locationFilter !== "all" ? 1 : 0,
                    clusterFilter !== "all" ? 1 : 0,
                    searchTerm ? 1 : 0,
                  ]).filter(Boolean).length
                }
              </span>{" "}
              active filters
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export const getGridLayoutClass = (
  isSidebarOpen: boolean,
  itemCount: number,
) => {
  const baseClasses = "grid gap-2 sm:gap-3"

  if (isSidebarOpen) {
    if (itemCount <= 3) {
      return `${baseClasses} grid-cols-1 xxs:grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3`
    }
    return `${baseClasses} grid-cols-2 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4`
  }
  if (itemCount <= 3) {
    return `${baseClasses} grid-cols-1 xxs:grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3`
  }
  return `${baseClasses} grid-cols-2 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6`
}
