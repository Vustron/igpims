"use client"

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/selects"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popovers"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import { Calendar } from "@/components/ui/calendars"
import { Search, CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/inputs"
import { Badge } from "@/components/ui/badges"
import { Plus } from "lucide-react"

import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { useDialog } from "@/hooks/use-dialog"
import { useState } from "react"

import { format } from "date-fns"
import { cn } from "@/utils/cn"

import type { ProjectRequest } from "@/features/project-request/project-request-store"

type StatusOption = ProjectRequest["status"] | "all"

export const ProjectRequestFilter = ({
  onFilterChange,
}: {
  onFilterChange?: (filters: {
    search: string
    status: StatusOption
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => void
}) => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusOption>("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })
  const [activeFilters, setActiveFilters] = useState<string[]>([])
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

  const statusOptions: { value: StatusOption; label: string }[] = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "in_review", label: "In Review" },
    { value: "checking", label: "Checking" },
    { value: "approved", label: "Approved" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ]

  const handleSearch = (value: string) => {
    setSearch(value)
    updateActiveFilters("search", value)
    if (onFilterChange) {
      onFilterChange({ search: value, status, dateRange })
    }
  }

  const handleStatusChange = (value: StatusOption) => {
    setStatus(value)
    updateActiveFilters("status", value)
    if (onFilterChange) {
      onFilterChange({ search, status: value, dateRange })
    }
  }

  const handleDateRangeChange = (
    range: { from: Date | undefined; to?: Date | undefined } | undefined,
  ) => {
    if (range) {
      const normalizedRange = {
        from: range.from,
        to: range.to || undefined,
      }
      setDateRange(normalizedRange)
      updateActiveFilters("date", normalizedRange)
      if (onFilterChange) {
        onFilterChange({ search, status, dateRange: normalizedRange })
      }
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
      if (onFilterChange) {
        onFilterChange({ search: "", status, dateRange })
      }
    } else if (type === "status") {
      setStatus("all")
      if (onFilterChange) {
        onFilterChange({ search, status: "all", dateRange })
      }
    } else if (type === "date") {
      setDateRange({ from: undefined, to: undefined })
      if (onFilterChange) {
        onFilterChange({
          search,
          status,
          dateRange: { from: undefined, to: undefined },
        })
      }
    }

    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setSearch("")
    setStatus("all")
    setDateRange({ from: undefined, to: undefined })
    setActiveFilters([])

    if (onFilterChange) {
      onFilterChange({
        search: "",
        status: "all",
        dateRange: { from: undefined, to: undefined },
      })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-slate-400" />
          <Input
            placeholder="Search by ID, title, or project lead..."
            className="pl-10"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-48">
          <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value as StatusOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
                "w-full justify-start text-left font-normal sm:w-[240px]",
                !dateRange.from && !dateRange.to && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
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

        {/* New IGP Proposal Button with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "gap-2 shadow-sm transition-all hover:shadow",
                hasActiveProjects && "cursor-not-allowed opacity-50",
              )}
              onClick={() => !hasActiveProjects && onOpen("createIgp")}
              disabled={hasActiveProjects}
            >
              <Plus className="size-4" />
              <span className="whitespace-nowrap">New IGP Proposal</span>
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

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 text-xs">Active filters:</span>
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
                  size="sm"
                  className="h-4 w-4 rounded-full p-0"
                  onClick={() => removeFilter(filter)}
                >
                  <span className="sr-only">Remove</span>
                  <X className="size-3" />
                </Button>
              </Badge>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-600 text-xs"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
