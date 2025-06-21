"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"

interface DynamicResultsSummaryProps {
  totalItems: number
  currentDataLength: number
  activeFiltersCount: number
  currentPage: number
  totalPages: number
  limit: number
  onPageSizeChange: (newLimit: number) => void
  resultLabel: string
}

export const DynamicResultsSummary = ({
  totalItems,
  currentDataLength,
  activeFiltersCount,
  currentPage,
  totalPages,
  limit,
  onPageSizeChange,
  resultLabel,
}: DynamicResultsSummaryProps) => {
  return (
    <div className="flex items-center justify-between text-muted-foreground text-sm">
      <div>
        Showing {currentDataLength} of {totalItems} {resultLabel}
        {activeFiltersCount > 0 && (
          <span className="ml-1">
            (filtered by {activeFiltersCount} criteria)
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Rows per page:</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="5" value="5">
                5
              </SelectItem>
              <SelectItem key="10" value="10">
                10
              </SelectItem>
              <SelectItem key="20" value="20">
                20
              </SelectItem>
              <SelectItem key="50" value="50">
                50
              </SelectItem>
              <SelectItem key="100" value="100">
                100
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
