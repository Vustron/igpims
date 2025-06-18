"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scrollareas"
import { FloatingLabelInput } from "@/components/ui/inputs"

import type { Table } from "@tanstack/react-table"
import { useId } from "react"

interface StaticFilterProps<TData> {
  placeholder: string
  disabled?: boolean
  filterValue: string
  onFilterChange: (value: string) => void
  table: Table<TData>
  isIgp?: boolean
  isLockerRental?: boolean
}

export function StaticFilter<TData>({
  placeholder,
  disabled,
  filterValue,
  onFilterChange,
}: StaticFilterProps<TData>) {
  const filterInputId = useId()
  return (
    <ScrollArea>
      <ScrollBar orientation="horizontal" className="z-10" />
      <div className="flex flex-col justify-between gap-4 p-2 sm:flex-row">
        <div className="flex flex-1 flex-wrap gap-2">
          <FloatingLabelInput
            id={filterInputId}
            type="text"
            label={placeholder}
            placeholder={placeholder}
            disabled={disabled}
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full p-5 shadow-xs sm:w-64"
          />
        </div>
      </div>
    </ScrollArea>
  )
}
