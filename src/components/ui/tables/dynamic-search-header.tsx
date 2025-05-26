"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/inputs"
import { TableActions } from "./table-actions"

interface DynamicSearchHeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  onToggleFilters: () => void
  activeFiltersCount: number
  onRefetch: () => void
  isFetching: boolean
  isIgp?: boolean
  isLockerRental?: boolean
  table: any
  isUser?: boolean
}

export const DynamicSearchHeader = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onRefetch,
  isFetching,
  isIgp,
  isLockerRental,
  table,
  isUser,
}: DynamicSearchHeaderProps) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="max-w-md flex-1">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <TableActions
        isIgp={isIgp}
        isLockerRental={isLockerRental}
        onRefetch={onRefetch}
        isFetching={isFetching}
        isUser={isUser}
        table={table}
      />
    </div>
  )
}
