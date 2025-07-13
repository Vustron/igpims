"use client"

import { Input } from "@/components/ui/inputs"
import { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { TableActions } from "./table-actions"

interface DynamicSearchHeaderProps<TData> {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  onToggleFilters: () => void
  activeFiltersCount: number
  onRefetch: () => void
  isFetching: boolean
  isIgp?: boolean
  isLockerRental?: boolean
  table: Table<TData>
  tableData: TData[]
  isUser?: boolean
  isOnViolations?: boolean
  isOnInspection?: boolean
  isOnWaterSupply?: boolean
  isOnWaterFund?: boolean
  isOnExpense?: boolean
  isBudgetFullyUtilized?: boolean
  requestId?: string
}

export const DynamicSearchHeader = <TData,>({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onRefetch,
  isFetching,
  isIgp,
  isLockerRental,
  table,
  tableData,
  isUser,
  isOnViolations,
  isOnInspection,
  isOnWaterSupply,
  isOnWaterFund,
  isOnExpense,
  isBudgetFullyUtilized,
  requestId,
}: DynamicSearchHeaderProps<TData>) => {
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
        tableData={tableData}
        isOnViolations={isOnViolations}
        isOnInspection={isOnInspection}
        isOnWaterSupply={isOnWaterSupply}
        isOnWaterFund={isOnWaterFund}
        isOnExpense={isOnExpense}
        isBudgetFullyUtilized={isBudgetFullyUtilized}
        requestId={requestId}
      />
    </div>
  )
}
