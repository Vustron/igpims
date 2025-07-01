"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Filter, X } from "lucide-react"
import { useId, useState } from "react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Checkbox } from "@/components/ui/checkboxes"
import { Label } from "@/components/ui/labels"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popovers"
import { Separator } from "@/components/ui/separators"
import { cn } from "@/utils/cn"

export type FilterState = {
  status: {
    operational: boolean
    maintenance: boolean
    "out-of-service": boolean
    offline: boolean
  }
  refill: {
    full: boolean
    medium: boolean
    low: boolean
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
  const statusOperationalId = useId()
  const statusMaintenanceId = useId()
  const statusOutOfServiceId = useId()
  const statusOfflineId = useId()
  const refillFullId = useId()
  const refillMediumId = useId()
  const refillLowId = useId()
  const refillEmptyId = useId()
  const refillTodayId = useId()
  const refillWeekId = useId()
  const refillMonthId = useId()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const isFilterActive = () => {
    const statusActive = Object.values(filters.status).some((v) => v)
    const refillActive = Object.values(filters.refill).some((v) => v)
    return statusActive || refillActive || !!filters.lastRefilled
  }

  const activeFilterCount = () => {
    const statusCount = Object.values(filters.status).filter((v) => v).length
    const refillCount = Object.values(filters.refill).filter((v) => v).length
    const lastRefilledCount = filters.lastRefilled ? 1 : 0
    return statusCount + refillCount + lastRefilledCount
  }

  const resetFilters = () => {
    setFilters({
      status: {
        operational: false,
        maintenance: false,
        "out-of-service": false,
        offline: false,
      },
      refill: {
        full: false,
        medium: false,
        low: false,
        empty: false,
      },
      lastRefilled: null,
    })
  }

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
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id={statusOperationalId}
                    checked={filters.status.operational}
                    onCheckedChange={(checked) =>
                      toggleFilter("status", "operational", checked === true)
                    }
                  />
                  <Label htmlFor={statusOperationalId} className="ml-2 text-sm">
                    Operational
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={statusMaintenanceId}
                    checked={filters.status.maintenance}
                    onCheckedChange={(checked) =>
                      toggleFilter("status", "maintenance", checked === true)
                    }
                  />
                  <Label htmlFor={statusMaintenanceId} className="ml-2 text-sm">
                    Maintenance
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={statusOutOfServiceId}
                    checked={filters.status["out-of-service"]}
                    onCheckedChange={(checked) =>
                      toggleFilter("status", "out-of-service", checked === true)
                    }
                  />
                  <Label
                    htmlFor={statusOutOfServiceId}
                    className="ml-2 text-sm"
                  >
                    Out of Service
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={statusOfflineId}
                    checked={filters.status.offline}
                    onCheckedChange={(checked) =>
                      toggleFilter("status", "offline", checked === true)
                    }
                  />
                  <Label htmlFor={statusOfflineId} className="ml-2 text-sm">
                    Offline
                  </Label>
                </div>
              </div>

              <Separator />

              {/* Refill Status Filter */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id={refillFullId}
                    checked={filters.refill.full}
                    onCheckedChange={(checked) =>
                      toggleFilter("refill", "full", checked === true)
                    }
                  />
                  <Label htmlFor={refillFullId} className="ml-2 text-sm">
                    Full
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={refillMediumId}
                    checked={filters.refill.medium}
                    onCheckedChange={(checked) =>
                      toggleFilter("refill", "medium", checked === true)
                    }
                  />
                  <Label htmlFor={refillMediumId} className="ml-2 text-sm">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={refillLowId}
                    checked={filters.refill.low}
                    onCheckedChange={(checked) =>
                      toggleFilter("refill", "low", checked === true)
                    }
                  />
                  <Label htmlFor={refillLowId} className="ml-2 text-sm">
                    Low
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={refillEmptyId}
                    checked={filters.refill.empty}
                    onCheckedChange={(checked) =>
                      toggleFilter("refill", "empty", checked === true)
                    }
                  />
                  <Label htmlFor={refillEmptyId} className="ml-2 text-sm">
                    Empty
                  </Label>
                </div>
              </div>

              <Separator />

              {/* Last Refilled Filter */}
              <div>
                <h4 className="mb-2 font-medium text-sm">Last Refilled</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id={refillTodayId}
                      checked={filters.lastRefilled === "today"}
                      onCheckedChange={(checked) =>
                        setLastRefilledFilter(checked ? "today" : null)
                      }
                    />
                    <Label htmlFor={refillTodayId} className="ml-2 text-sm">
                      Today
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id={refillWeekId}
                      checked={filters.lastRefilled === "week"}
                      onCheckedChange={(checked) =>
                        setLastRefilledFilter(checked ? "week" : null)
                      }
                    />
                    <Label htmlFor={refillWeekId} className="ml-2 text-sm">
                      In the last 7 days
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id={refillMonthId}
                      checked={filters.lastRefilled === "month"}
                      onCheckedChange={(checked) =>
                        setLastRefilledFilter(checked ? "month" : null)
                      }
                    />
                    <Label htmlFor={refillMonthId} className="ml-2 text-sm">
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
                    {key === "out-of-service"
                      ? "Out of Service"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
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
