"use client"

import { FundRequestWithUser } from "@/backend/actions/fund-request/find-by-id"
import { FundRequest } from "@/backend/db/schemas"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Calendar } from "@/components/ui/calendars"
import { Input } from "@/components/ui/inputs"
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
import { useDialog } from "@/hooks/use-dialog"
import { cn } from "@/utils/cn"
import { format } from "date-fns"
import { CalendarIcon, Plus, Search, X } from "lucide-react"
import { useState } from "react"

type StatusOption = FundRequest["status"] | "all"

interface FundRequestFilterProps {
  onFilterChange?: (filters: {
    search?: string
    status?: StatusOption
    startDate?: string
    endDate?: string
  }) => void
  statusCounts?: Record<StatusOption, number>
  isSidebarOpen?: boolean
  fundRequest: FundRequestWithUser | undefined
}

export const FundRequestFilter = ({
  onFilterChange,
  statusCounts,
  isSidebarOpen = false,
  fundRequest,
}: FundRequestFilterProps) => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusOption>("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const { onOpen } = useDialog()

  const statusOptions: {
    value: StatusOption
    label: string
    count?: number
  }[] = [
    { value: "all", label: "All Statuses", count: statusCounts?.all },
    { value: "pending", label: "Pending", count: statusCounts?.pending },
    { value: "in_review", label: "In Review", count: statusCounts?.in_review },
    { value: "checking", label: "Checking", count: statusCounts?.checking },
    { value: "approved", label: "Approved", count: statusCounts?.approved },
    { value: "disbursed", label: "Disbursed", count: statusCounts?.disbursed },
    { value: "received", label: "Received", count: statusCounts?.received },
    { value: "receipted", label: "Receipted", count: statusCounts?.receipted },
    { value: "validated", label: "Validated", count: statusCounts?.validated },
    { value: "rejected", label: "Rejected", count: statusCounts?.rejected },
  ]

  const handleSearch = (value: string) => {
    setSearch(value)
    updateActiveFilters("search", value)
    if (onFilterChange) {
      onFilterChange({
        search: value || undefined,
        status: status !== "all" ? status : undefined,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
      })
    }
  }

  const handleStatusChange = (value: StatusOption) => {
    setStatus(value)
    updateActiveFilters("status", value)
    if (onFilterChange) {
      onFilterChange({
        search: search || undefined,
        status: value !== "all" ? value : undefined,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
      })
    }
  }

  const handleDateRangeChange = (
    range: { from: Date | undefined; to?: Date | undefined } | undefined,
  ) => {
    const newRange = {
      from: range?.from ?? undefined,
      to: range?.to ?? undefined,
    }
    setDateRange(newRange)
    updateActiveFilters("date", newRange)
    if (onFilterChange) {
      onFilterChange({
        search: search || undefined,
        status: status !== "all" ? status : undefined,
        startDate: newRange.from ? newRange.from.toISOString() : undefined,
        endDate: newRange.to ? newRange.to.toISOString() : undefined,
      })
    }
  }

  const updateActiveFilters = (type: string, value: any) => {
    const newFilters = [
      ...activeFilters.filter((f) => !f.startsWith(`${type}:`)),
    ]

    if (type === "search" && value) {
      newFilters.push(`search:${value}`)
    } else if (type === "status" && value !== "all") {
      newFilters.push(`status:${value}`)
    } else if (type === "date" && (value.from || value.to)) {
      const dateLabel =
        value.from && value.to
          ? `${format(value.from, "MMM d")} - ${format(value.to, "MMM d")}`
          : value.from
            ? `From ${format(value.from, "MMM d")}`
            : value.to
              ? `Until ${format(value.to, "MMM d")}`
              : ""

      if (dateLabel) {
        newFilters.push(`date:${dateLabel}`)
      }
    }

    setActiveFilters(newFilters)
  }

  const removeFilter = (filter: string) => {
    const [type] = filter.split(":")

    if (type === "search") {
      setSearch("")
    } else if (type === "status") {
      setStatus("all")
    } else if (type === "date") {
      setDateRange({ from: undefined, to: undefined })
    }

    setActiveFilters(activeFilters.filter((f) => f !== filter))

    if (onFilterChange) {
      onFilterChange({
        search: type === "search" ? undefined : search || undefined,
        status:
          type === "status" ? undefined : status !== "all" ? status : undefined,
        startDate: type === "date" ? undefined : dateRange.from?.toISOString(),
        endDate: type === "date" ? undefined : dateRange.to?.toISOString(),
      })
    }
  }

  const clearAllFilters = () => {
    setSearch("")
    setStatus("all")
    setDateRange({ from: undefined, to: undefined })
    setActiveFilters([])

    if (onFilterChange) {
      onFilterChange({
        search: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
      })
    }
  }

  return (
    <div className="mt-2 mb-5">
      <div
        className={cn(
          "flex flex-col gap-3",
          isSidebarOpen ? "sm:flex-col" : "sm:flex-row",
        )}
      >
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by ID, purpose or requestor..."
            className="pl-10"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className={cn("w-full", isSidebarOpen ? "" : "sm:w-48")}>
          <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value as StatusOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.count === 0 && option.value !== "all"}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {option.count}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date range filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                isSidebarOpen ? "" : "sm:w-[240px]",
                !dateRange.from && !dateRange.to && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        <Button
          className={cn(
            "gap-2 shadow-sm transition-all hover:shadow",
            isSidebarOpen ? "w-full" : "",
          )}
          onClick={() =>
            onOpen("createFundRequest", { fundRequest: fundRequest })
          }
        >
          <Plus className="size-4" />
          <span className="whitespace-nowrap">New Request</span>
        </Button>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Active filters:</span>
          {activeFilters.map((filter) => {
            const [type, value] = filter.split(":", 2)
            return (
              <Badge
                key={filter}
                variant="outline"
                className="flex items-center gap-1 bg-slate-50 px-3 py-1"
              >
                <span className="text-xs">
                  {type === "search"
                    ? "Search: "
                    : type === "status"
                      ? "Status: "
                      : ""}
                  {value}
                </span>
                <Button
                  variant={"ghost"}
                  className="rounded-full bg-background"
                  onClick={() => removeFilter(filter)}
                >
                  <span className="sr-only">Remove</span>
                  <X className="size-4" />
                </Button>
              </Badge>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-slate-600"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
