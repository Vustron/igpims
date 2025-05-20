"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popovers"
import { Separator } from "@/components/ui/separators"
import { Checkbox } from "@/components/ui/checkboxes"
import { Button } from "@/components/ui/buttons"
import { Label } from "@/components/ui/labels"
import { Badge } from "@/components/ui/badges"
import { Filter, X } from "lucide-react"

import { useState } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"

export type FilterState = {
  status: {
    online: boolean
    offline: boolean
    maintenance: boolean
  }
  refill: {
    full: boolean
    low: boolean
    critical: boolean
    empty: boolean
  }
  lastRefilled: string | null
}

interface WaterVendoFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

export const WaterVendoFilters = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
}: WaterVendoFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Check if any filter is active
  const isFilterActive = () => {
    const statusActive = Object.values(filters.status).some((v) => v)
    const refillActive = Object.values(filters.refill).some((v) => v)
    return statusActive || refillActive || !!filters.lastRefilled
  }

  // Get count of active filters
  const activeFilterCount = () => {
    const statusCount = Object.values(filters.status).filter((v) => v).length
    const refillCount = Object.values(filters.refill).filter((v) => v).length
    const lastRefilledCount = filters.lastRefilled ? 1 : 0
    return statusCount + refillCount + lastRefilledCount
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: {
        online: false,
        offline: false,
        maintenance: false,
      },
      refill: {
        full: false,
        low: false,
        critical: false,
        empty: false,
      },
      lastRefilled: null,
    })
  }

  // Toggle individual filter
  const toggleFilter = (
    category: "status" | "refill",
    key: string,
    value: boolean,
  ) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [key]: value,
      },
    })
  }

  // Set last refilled filter
  const setLastRefilledFilter = (value: string | null) => {
    setFilters({
      ...filters,
      lastRefilled: value,
    })
  }

  return (
    <>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "relative h-9",
              isFilterActive() && "border-primary/50 bg-primary/5",
            )}
          >
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filter
            {isFilterActive() && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 min-w-5 rounded-full px-1 text-xs"
              >
                {activeFilterCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="end">
          <div className="flex items-center justify-between border-b p-3">
            <div className="font-medium text-sm">Filter Vendos</div>
            {isFilterActive() && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={resetFilters}
              >
                Reset
              </Button>
            )}
          </div>

          <div className="p-4">
            <div className="space-y-4">
              {/* Vendo Status Filter */}
              <div>
                <h4 className="mb-2 font-medium text-sm">Vendo Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="status-online"
                      checked={filters.status.online}
                      onCheckedChange={(checked) =>
                        toggleFilter("status", "online", checked === true)
                      }
                    />
                    <Label htmlFor="status-online" className="ml-2 text-sm">
                      Online
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="status-offline"
                      checked={filters.status.offline}
                      onCheckedChange={(checked) =>
                        toggleFilter("status", "offline", checked === true)
                      }
                    />
                    <Label htmlFor="status-offline" className="ml-2 text-sm">
                      Offline
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="status-maintenance"
                      checked={filters.status.maintenance}
                      onCheckedChange={(checked) =>
                        toggleFilter("status", "maintenance", checked === true)
                      }
                    />
                    <Label
                      htmlFor="status-maintenance"
                      className="ml-2 text-sm"
                    >
                      Maintenance
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Refill Status Filter */}
              <div>
                <h4 className="mb-2 font-medium text-sm">Refill Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="refill-full"
                      checked={filters.refill.full}
                      onCheckedChange={(checked) =>
                        toggleFilter("refill", "full", checked === true)
                      }
                    />
                    <Label htmlFor="refill-full" className="ml-2 text-sm">
                      Full
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="refill-low"
                      checked={filters.refill.low}
                      onCheckedChange={(checked) =>
                        toggleFilter("refill", "low", checked === true)
                      }
                    />
                    <Label htmlFor="refill-low" className="ml-2 text-sm">
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="refill-critical"
                      checked={filters.refill.critical}
                      onCheckedChange={(checked) =>
                        toggleFilter("refill", "critical", checked === true)
                      }
                    />
                    <Label htmlFor="refill-critical" className="ml-2 text-sm">
                      Critical
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="refill-empty"
                      checked={filters.refill.empty}
                      onCheckedChange={(checked) =>
                        toggleFilter("refill", "empty", checked === true)
                      }
                    />
                    <Label htmlFor="refill-empty" className="ml-2 text-sm">
                      Empty
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Last Refilled Filter */}
              <div>
                <h4 className="mb-2 font-medium text-sm">Last Refilled</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="refill-today"
                      checked={filters.lastRefilled === "today"}
                      onCheckedChange={(checked) =>
                        setLastRefilledFilter(checked ? "today" : null)
                      }
                    />
                    <Label htmlFor="refill-today" className="ml-2 text-sm">
                      Today
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="refill-week"
                      checked={filters.lastRefilled === "week"}
                      onCheckedChange={(checked) =>
                        setLastRefilledFilter(checked ? "week" : null)
                      }
                    />
                    <Label htmlFor="refill-week" className="ml-2 text-sm">
                      In the last 7 days
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="refill-month"
                      checked={filters.lastRefilled === "month"}
                      onCheckedChange={(checked) =>
                        setLastRefilledFilter(checked ? "month" : null)
                      }
                    />
                    <Label htmlFor="refill-month" className="ml-2 text-sm">
                      In the last 30 days
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t p-3">
            <div className="text-muted-foreground text-sm">
              Showing <strong>{filteredCount}</strong> of{" "}
              <strong>{totalCount}</strong> vendos
            </div>
            <Button
              size="sm"
              className="h-8"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filters display */}
      <AnimatePresence>
        {isFilterActive() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {Object.entries(filters.status).map(
              ([key, value]) =>
                value && (
                  <Badge
                    key={`status-${key}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter("status", key, false)}
                    />
                  </Badge>
                ),
            )}

            {Object.entries(filters.refill).map(
              ([key, value]) =>
                value && (
                  <Badge
                    key={`refill-${key}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter("refill", key, false)}
                    />
                  </Badge>
                ),
            )}

            {filters.lastRefilled && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {filters.lastRefilled === "today"
                  ? "Refilled today"
                  : filters.lastRefilled === "week"
                    ? "Refilled in last week"
                    : "Refilled in last month"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setLastRefilledFilter(null)}
                />
              </Badge>
            )}

            {isFilterActive() && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
