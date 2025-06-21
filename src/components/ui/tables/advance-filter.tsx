"use client"

import { format } from "date-fns"
import {
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  ShieldCheck,
  Tag,
  User,
  Wallet,
  X,
} from "lucide-react"
import { useId, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Calendar as CalendarComponent } from "@/components/ui/calendars"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { Input } from "@/components/ui/inputs"
import { Label } from "@/components/ui/labels"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popovers"

export interface DateRangeFilter {
  start: Date | null
  end: Date | null
}

export interface FilterState {
  renterName: string
  courseAndSet: string
  rentalStatus: string[]
  paymentStatus: string[]
  dateRented: DateRangeFilter
  dateDue: DateRangeFilter
  createdAt: DateRangeFilter
  updatedAt: DateRangeFilter
}

interface AdvancedFilterProps {
  advancedFilters: FilterState
  setAdvancedFilters: React.Dispatch<React.SetStateAction<FilterState>>
  statusOptions: {
    rental: string[]
    payment: string[]
  }
  onClearAllFilters: () => void
}

export function AdvancedFilter({
  advancedFilters,
  setAdvancedFilters,
  statusOptions,
  onClearAllFilters,
}: AdvancedFilterProps) {
  const renterNameFilterId = useId()
  const courseFilterId = useId()
  const [showDatePickerFor, setShowDatePickerFor] = useState<string | null>(
    null,
  )

  const activeFilterCount = useMemo(() => {
    let count = 0

    Object.entries(advancedFilters).forEach(([key, value]) => {
      switch (true) {
        case key === "renterName" && Boolean(value):
        case key === "courseAndSet" && Boolean(value):
          count++
          break
        case key === "rentalStatus" && (value as string[]).length > 0:
        case key === "paymentStatus" && (value as string[]).length > 0:
          count++
          break
        case ["dateRented", "dateDue", "createdAt", "updatedAt"].includes(
          key,
        ): {
          const dateFilter = value as DateRangeFilter
          if (dateFilter.start || dateFilter.end) count++
          break
        }
      }
    })

    return count
  }, [advancedFilters])

  const toggleStatusFilter = (
    field: "rentalStatus" | "paymentStatus",
    value: string,
  ) => {
    setAdvancedFilters((prev) => {
      const currentValues = [...prev[field]]
      const index = currentValues.indexOf(value)

      if (index === -1) {
        return { ...prev, [field]: [...currentValues, value] }
      }
      currentValues.splice(index, 1)
      return { ...prev, [field]: currentValues }
    })
  }

  const formatDateRange = (range: DateRangeFilter) => {
    if (!range.start && !range.end) return "Any time"

    if (range.start && range.end) {
      return `${format(range.start, "MMM d, yy")} - ${format(range.end, "MMM d, yy")}`
    }

    if (range.start) return `From ${format(range.start, "MMM d, yy")}`
    if (range.end) return `Until ${format(range.end, "MMM d, yy")}`

    return "Any time"
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={activeFilterCount > 0 ? "default" : "outline"}
          size="icon"
          className="h-10 w-10"
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="-right-1 -top-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
          <span className="sr-only">Open filter menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Advanced Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={onClearAllFilters}
            >
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {/* Renter Name Filter */}
          <div className="space-y-1">
            <div className="flex items-center">
              <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <Label className="font-medium text-xs">Renter Name</Label>
            </div>
            <Input
              id={renterNameFilterId}
              type="text"
              placeholder=""
              value={advancedFilters.renterName}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  renterName: e.target.value,
                })
              }
              className="h-8 text-xs"
            />
          </div>

          {/* Course and Set Filter */}
          <div className="space-y-1">
            <div className="flex items-center">
              <Tag className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <Label className="font-medium text-xs">Course & Set</Label>
            </div>
            <Input
              id={courseFilterId}
              type="text"
              placeholder=""
              value={advancedFilters.courseAndSet}
              onChange={(e) =>
                setAdvancedFilters({
                  ...advancedFilters,
                  courseAndSet: e.target.value,
                })
              }
              className="h-8 text-xs"
            />
          </div>

          {/* Rental Status Filter */}
          <div className="space-y-1">
            <div className="flex items-center">
              <ShieldCheck className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <Label className="font-medium text-xs">Rental Status</Label>
            </div>
            <div className="flex flex-wrap gap-1">
              {statusOptions.rental.map((status) => (
                <Badge
                  key={status}
                  variant={
                    advancedFilters.rentalStatus.includes(status)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer text-xs"
                  onClick={() => toggleStatusFilter("rentalStatus", status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {advancedFilters.rentalStatus.includes(status) && (
                    <CheckCircle className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Payment Status Filter */}
          <div className="space-y-1">
            <div className="flex items-center">
              <Wallet className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <Label className="font-medium text-xs">Payment Status</Label>
            </div>
            <div className="flex flex-wrap gap-1">
              {statusOptions.payment.map((status) => (
                <Badge
                  key={status}
                  variant={
                    advancedFilters.paymentStatus.includes(status)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer text-xs"
                  onClick={() => toggleStatusFilter("paymentStatus", status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {advancedFilters.paymentStatus.includes(status) && (
                    <CheckCircle className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Calendar className="mr-2 h-3.5 w-3.5" />
                Date Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs">
                Filter by Date
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Date Rented Range */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Calendar className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Rental Date</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-2">
                  <DateRangePicker
                    startDate={advancedFilters.dateRented.start}
                    endDate={advancedFilters.dateRented.end}
                    onStartDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        dateRented: {
                          ...advancedFilters.dateRented,
                          start: date,
                        },
                      })
                    }}
                    onEndDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        dateRented: {
                          ...advancedFilters.dateRented,
                          end: date,
                        },
                      })
                    }}
                    onClear={() => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        dateRented: { start: null, end: null },
                      })
                    }}
                    showDatePickerFor={showDatePickerFor}
                    setShowDatePickerFor={setShowDatePickerFor}
                    pickerIdPrefix="dateRented"
                  />
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Due Date Range */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Clock className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Due Date</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-2">
                  <DateRangePicker
                    startDate={advancedFilters.dateDue.start}
                    endDate={advancedFilters.dateDue.end}
                    onStartDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        dateDue: {
                          ...advancedFilters.dateDue,
                          start: date,
                        },
                      })
                    }}
                    onEndDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        dateDue: {
                          ...advancedFilters.dateDue,
                          end: date,
                        },
                      })
                    }}
                    onClear={() => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        dateDue: { start: null, end: null },
                      })
                    }}
                    showDatePickerFor={showDatePickerFor}
                    setShowDatePickerFor={setShowDatePickerFor}
                    pickerIdPrefix="dateDue"
                  />
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Created At Range */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Created Date</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-2">
                  <DateRangePicker
                    startDate={advancedFilters.createdAt.start}
                    endDate={advancedFilters.createdAt.end}
                    onStartDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        createdAt: {
                          ...advancedFilters.createdAt,
                          start: date,
                        },
                      })
                    }}
                    onEndDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        createdAt: {
                          ...advancedFilters.createdAt,
                          end: date,
                        },
                      })
                    }}
                    onClear={() => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        createdAt: { start: null, end: null },
                      })
                    }}
                    showDatePickerFor={showDatePickerFor}
                    setShowDatePickerFor={setShowDatePickerFor}
                    pickerIdPrefix="createdAt"
                  />
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Updated At Range */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Updated Date</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-2">
                  <DateRangePicker
                    startDate={advancedFilters.updatedAt.start}
                    endDate={advancedFilters.updatedAt.end}
                    onStartDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        updatedAt: {
                          ...advancedFilters.updatedAt,
                          start: date,
                        },
                      })
                    }}
                    onEndDateChange={(date) => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        updatedAt: {
                          ...advancedFilters.updatedAt,
                          end: date,
                        },
                      })
                    }}
                    onClear={() => {
                      setAdvancedFilters({
                        ...advancedFilters,
                        updatedAt: { start: null, end: null },
                      })
                    }}
                    showDatePickerFor={showDatePickerFor}
                    setShowDatePickerFor={setShowDatePickerFor}
                    pickerIdPrefix="updatedAt"
                  />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 rounded-md border bg-muted/50 p-2 text-xs">
            <h4 className="font-medium">Active filters:</h4>
            <div className="mt-2 space-y-1">
              {advancedFilters.renterName && (
                <div className="flex justify-between">
                  <span className="font-medium">Renter:</span>
                  <span>{advancedFilters.renterName}</span>
                </div>
              )}
              {advancedFilters.courseAndSet && (
                <div className="flex justify-between">
                  <span className="font-medium">Course:</span>
                  <span>{advancedFilters.courseAndSet}</span>
                </div>
              )}
              {advancedFilters.rentalStatus.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span>{advancedFilters.rentalStatus.join(", ")}</span>
                </div>
              )}
              {advancedFilters.paymentStatus.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment:</span>
                  <span>{advancedFilters.paymentStatus.join(", ")}</span>
                </div>
              )}
              {(advancedFilters.dateRented.start ||
                advancedFilters.dateRented.end) && (
                <div className="flex justify-between">
                  <span className="font-medium">Rental date:</span>
                  <span>{formatDateRange(advancedFilters.dateRented)}</span>
                </div>
              )}
              {(advancedFilters.dateDue.start ||
                advancedFilters.dateDue.end) && (
                <div className="flex justify-between">
                  <span className="font-medium">Due date:</span>
                  <span>{formatDateRange(advancedFilters.dateDue)}</span>
                </div>
              )}
              {(advancedFilters.createdAt.start ||
                advancedFilters.createdAt.end) && (
                <div className="flex justify-between">
                  <span className="font-medium">Created:</span>
                  <span>{formatDateRange(advancedFilters.createdAt)}</span>
                </div>
              )}
              {(advancedFilters.updatedAt.start ||
                advancedFilters.updatedAt.end) && (
                <div className="flex justify-between">
                  <span className="font-medium">Updated:</span>
                  <span>{formatDateRange(advancedFilters.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Helper component for date range picker
interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  onClear: () => void
  showDatePickerFor: string | null
  setShowDatePickerFor: (id: string | null) => void
  pickerIdPrefix: string
}

function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  showDatePickerFor,
  setShowDatePickerFor,
  pickerIdPrefix,
}: DateRangePickerProps) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-xs">Select range</p>
      <div className="flex gap-2">
        <Popover
          open={showDatePickerFor === `${pickerIdPrefix}-start`}
          onOpenChange={(open) => {
            if (open) setShowDatePickerFor(`${pickerIdPrefix}-start`)
            else setShowDatePickerFor(null)
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              {startDate ? format(startDate, "PP") : "From"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => {
                onStartDateChange(date!)
                setShowDatePickerFor(null)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover
          open={showDatePickerFor === `${pickerIdPrefix}-end`}
          onOpenChange={(open) => {
            if (open) setShowDatePickerFor(`${pickerIdPrefix}-end`)
            else setShowDatePickerFor(null)
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              {endDate ? format(endDate, "PP") : "To"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => {
                onEndDateChange(date!)
                setShowDatePickerFor(null)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {(startDate || endDate) && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-8 text-xs"
          onClick={onClear}
        >
          <X className="mr-1 h-3 w-3" />
          Clear dates
        </Button>
      )}
    </div>
  )
}
