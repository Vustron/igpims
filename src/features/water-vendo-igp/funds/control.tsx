"use client"

import { motion } from "framer-motion"
import { Calendar, Filter, PlusCircle, Printer, Search, X } from "lucide-react"
import { useId, useState } from "react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Checkbox } from "@/components/ui/checkboxes"
import { Input } from "@/components/ui/inputs"
import { Label } from "@/components/ui/labels"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popovers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheets"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import { useDialog } from "@/hooks/use-dialog"

interface WaterFundsControlsProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  isSheetOpen: boolean
  setIsSheetOpen: (value: boolean) => void
  timeRange: string
  setTimeRange: (value: string) => void
  onPrint?: () => void
  onAddCollection?: () => void
}

export const WaterFundsControls = ({
  searchTerm,
  setSearchTerm,
  isSheetOpen,
  setIsSheetOpen,
  timeRange,
  setTimeRange,
  onPrint = () => console.log("Print"),
  onAddCollection = () => console.log("Add collection"),
}: WaterFundsControlsProps) => {
  const [activeFilters, setActiveFilters] = useState<{
    locations: string[]
    hasExpenses: boolean
    dateRange: { from?: Date; to?: Date }
  }>({
    locations: [],
    hasExpenses: false,
    dateRange: {},
  })
  const hasExpensesId = useId()
  const locationId = useId()
  const gallonsId = useId()
  const expensesId = useId()
  const revenueId = useId()
  const dateId = useId()
  const { onOpen } = useDialog()

  const hasActiveFilters =
    activeFilters.locations.length > 0 ||
    activeFilters.hasExpenses ||
    activeFilters.dateRange.from !== undefined

  const clearFilters = () => {
    setActiveFilters({
      locations: [],
      hasExpenses: false,
      dateRange: {},
    })
  }

  const toggleLocation = (location: string) => {
    setActiveFilters((prev) => {
      if (prev.locations.includes(location)) {
        return {
          ...prev,
          locations: prev.locations.filter((loc) => loc !== location),
        }
      }
      return {
        ...prev,
        locations: [...prev.locations, location],
      }
    })
  }

  const locations = ["Academic Building", "MPEC", "IC", "IADS"]

  const controlsVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      initial="hidden"
      animate="visible"
      variants={controlsVariants}
    >
      <div className="flex w-full flex-col gap-2 sm:max-w-xs">
        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 rounded-md border border-input pr-4 pl-9"
          />
          {searchTerm && (
            <Button
              className="absolute top-2.5 right-3"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {activeFilters.locations.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="flex items-center gap-1 py-0.5 text-xs"
              >
                {location}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleLocation(location)}
                />
              </Badge>
            ))}

            {activeFilters.hasExpenses && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 py-0.5 text-xs"
              >
                Has expenses
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setActiveFilters((prev) => ({
                      ...prev,
                      hasExpenses: false,
                    }))
                  }
                />
              </Badge>
            )}

            {activeFilters.dateRange.from && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 py-0.5 text-xs"
              >
                <Calendar className="h-3 w-3" />
                {activeFilters.dateRange.from.toLocaleDateString()} -
                {activeFilters.dateRange.to
                  ? activeFilters.dateRange.to.toLocaleDateString()
                  : "Present"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setActiveFilters((prev) => ({ ...prev, dateRange: {} }))
                  }
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-muted-foreground text-xs hover:text-foreground"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`flex h-10 items-center gap-2 px-3 ${hasActiveFilters ? "border-primary/30 bg-primary/5 text-primary" : ""}`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="h-5 min-w-5 rounded-full px-1 text-xs"
                >
                  {activeFilters.locations.length +
                    (activeFilters.hasExpenses ? 1 : 0) +
                    (activeFilters.dateRange.from ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="center">
            <div className="border-b p-2">
              <div className="px-3 py-1.5 font-medium text-sm">Filters</div>
            </div>

            <div className="max-h-[60vh] overflow-auto p-4">
              <div className="space-y-4">
                {/* Location filter */}
                <div>
                  <h4 className="mb-2 font-medium text-sm">Locations</h4>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <div key={location} className="flex items-center">
                        <Checkbox
                          id={`location-${location}`}
                          checked={activeFilters.locations.includes(location)}
                          onCheckedChange={() => toggleLocation(location)}
                        />
                        <label
                          htmlFor={`location-${location}`}
                          className="ml-2 text-sm"
                        >
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expenses filter */}
                <div>
                  <h4 className="mb-2 font-medium text-sm">Financial</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id={hasExpensesId}
                        checked={activeFilters.hasExpenses}
                        onCheckedChange={(checked) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            hasExpenses: checked === true,
                          }))
                        }
                      />
                      <label htmlFor={hasExpensesId} className="ml-2 text-sm">
                        Has expenses
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-2">
              <div className="flex items-center justify-between px-3 py-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-sm"
                  disabled={!hasActiveFilters}
                >
                  Clear all
                </Button>
                <Button size="sm" className="h-8 text-sm">
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="h-10 w-[140px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Time</SelectItem>
            <SelectItem value="WEEK">This Week</SelectItem>
            <SelectItem value="MONTH">This Month</SelectItem>
            <SelectItem value="QUARTER">This Quarter</SelectItem>
            <SelectItem value="YEAR">This Year</SelectItem>
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={onPrint}
              >
                <Printer className="h-4 w-4" />
                <span className="sr-only">Print report</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print report</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Mobile: Sheet, Desktop: Button */}
        <div className="block sm:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="sm"
                className="flex h-10 items-center"
                onClick={() => onOpen("createWaterFund")}
              >
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Add
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-md">
              <SheetHeader className="space-y-1">
                <SheetTitle>Add Fund Collection</SheetTitle>
                <SheetDescription>
                  Enter the details for the new water vendo fund collection
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={locationId}>Location</Label>
                  <Select>
                    <SelectTrigger id={locationId}>
                      <SelectValue placeholder="Select vendo location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem
                          key={location}
                          value={location.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={gallonsId}>Gallons Used</Label>
                  <Input
                    id={gallonsId}
                    type="number"
                    min="0"
                    placeholder="Enter gallons used"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={expensesId}>Expenses (₱)</Label>
                  <Input
                    id={expensesId}
                    type="number"
                    min="0"
                    placeholder="Enter expenses"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={revenueId}>Revenue (₱)</Label>
                  <Input
                    id={revenueId}
                    type="number"
                    min="0"
                    placeholder="Enter revenue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={dateId}>Collection Date</Label>
                  <Input id={dateId} type="date" />
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    onAddCollection()
                    setIsSheetOpen(false)
                  }}
                >
                  Add Collection
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden sm:block">
          <Button
            size="sm"
            className="flex h-10 items-center"
            onClick={() => onOpen("createWaterFund")}
          >
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Add Fund Collection
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
