"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdowns"
import { getActionLabel } from "@/features/notification/notification-helpers"
import { Filter, Search, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/inputs"

import type {
  NotificationType,
  NotificationAction,
} from "@/features/notification/notification-types"

interface NotificationFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterType: NotificationType | "all"
  setFilterType: (type: NotificationType | "all") => void
  filterAction: NotificationAction | "all"
  setFilterAction: (action: NotificationAction | "all") => void
}

export const NotificationFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterAction,
  setFilterAction,
}: NotificationFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-slate-50 p-4 sm:flex-row sm:items-center">
      <div className="relative flex-grow">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="-translate-y-1/2 absolute top-1/2 right-1 h-6 w-6 text-slate-400 hover:text-slate-600"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="min-w-28 gap-1.5">
              <Filter className="h-4 w-4" />
              {filterType === "all"
                ? "All Types"
                : filterType === "fund_request"
                  ? "Fund Requests"
                  : "IGP Proposals"}
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterType("all")}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("fund_request")}>
              Fund Requests
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("project_request")}>
              IGP Proposals
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="min-w-28 gap-1.5">
              <Filter className="h-4 w-4" />
              {filterAction === "all"
                ? "All Actions"
                : getActionLabel(filterAction)}
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterAction("all")}>
              All Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("submitted")}>
              Submitted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("reviewed")}>
              Reviewed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("approved")}>
              Approved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("rejected")}>
              Rejected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("checked")}>
              Checked
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("disbursed")}>
              Disbursed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("receipted")}>
              Receipted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterAction("validated")}>
              Validated
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterAction("resolution_created")}
            >
              Resolution Created
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
