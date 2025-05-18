"use client"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/tables"
import {
  History,
  Settings2,
  ChevronLeft,
  ChevronRight,
  PrinterIcon,
} from "lucide-react"
import { AdvancedFilter } from "@/components/ui/tables/advance-filter"
import { ScrollArea, ScrollBar } from "@/components/ui/scrollareas"
import { FloatingLabelInput } from "@/components/ui/inputs"
import { EmptyState } from "@/components/ui/fallbacks"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import { useReactTable } from "@tanstack/react-table"
import { useMemo, useState } from "react"

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import { deepSearch } from "@/utils/deep-search"

import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import type { FilterState } from "@/components/ui/tables/advance-filter"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  placeholder: string
  disabled?: boolean
  isLockerRental?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder,
  disabled,
  isLockerRental,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [filterValue, setFilterValue] = useState<string>("")

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    renterName: "",
    courseAndSet: "",
    rentalStatus: [],
    paymentStatus: [],
    dateRented: { start: null, end: null },
    dateDue: { start: null, end: null },
    createdAt: { start: null, end: null },
    updatedAt: { start: null, end: null },
  })

  // Track if any advanced filters are active
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (advancedFilters.renterName) count++
    if (advancedFilters.courseAndSet) count++
    if (advancedFilters.rentalStatus.length > 0) count++
    if (advancedFilters.paymentStatus.length > 0) count++
    if (advancedFilters.dateRented.start || advancedFilters.dateRented.end)
      count++
    if (advancedFilters.dateDue.start || advancedFilters.dateDue.end) count++
    if (advancedFilters.createdAt.start || advancedFilters.createdAt.end)
      count++
    if (advancedFilters.updatedAt.start || advancedFilters.updatedAt.end)
      count++
    return count
  }, [advancedFilters])

  // Apply advanced filters to data
  const filteredData = useMemo(() => {
    // First apply text search filter
    let filtered = data.filter((item) => deepSearch(item, filterValue))

    // Then apply advanced filters
    filtered = filtered.filter((item: any) => {
      // Renter name filter
      if (
        advancedFilters.renterName &&
        !item.renterName
          ?.toLowerCase()
          .includes(advancedFilters.renterName.toLowerCase())
      ) {
        return false
      }

      // Course and set filter
      if (
        advancedFilters.courseAndSet &&
        !item.courseAndSet
          ?.toLowerCase()
          .includes(advancedFilters.courseAndSet.toLowerCase())
      ) {
        return false
      }

      // Rental status filter
      if (
        advancedFilters.rentalStatus.length > 0 &&
        !advancedFilters.rentalStatus.includes(item.rentalStatus)
      ) {
        return false
      }

      // Payment status filter
      if (
        advancedFilters.paymentStatus.length > 0 &&
        !advancedFilters.paymentStatus.includes(item.paymentStatus)
      ) {
        return false
      }

      // Date filters
      const checkDateRange = (
        date: number | undefined,
        range: { start: Date | null; end: Date | null },
      ) => {
        if (!date) return true
        const itemDate = new Date(date)

        if (range.start && itemDate < range.start) {
          return false
        }

        if (range.end) {
          // Set to end of day for the end date
          const endDate = new Date(range.end)
          endDate.setHours(23, 59, 59, 999)
          if (itemDate > endDate) {
            return false
          }
        }

        return true
      }

      if (!checkDateRange(item.dateRented, advancedFilters.dateRented))
        return false
      if (!checkDateRange(item.dateDue, advancedFilters.dateDue)) return false
      if (!checkDateRange(item.createdAt, advancedFilters.createdAt))
        return false
      if (!checkDateRange(item.updatedAt, advancedFilters.updatedAt))
        return false

      return true
    })

    return filtered
  }, [data, filterValue, advancedFilters])

  // Function to clear all filters
  const clearFilters = () => {
    setAdvancedFilters({
      renterName: "",
      courseAndSet: "",
      rentalStatus: [],
      paymentStatus: [],
      dateRented: { start: null, end: null },
      dateDue: { start: null, end: null },
      createdAt: { start: null, end: null },
      updatedAt: { start: null, end: null },
    })
    setFilterValue("")
  }

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  })

  const memoizedRows = useMemo(
    () => table.getRowModel().rows,
    [table.getRowModel().rows],
  )

  // Get available status options from data
  const statusOptions = useMemo(() => {
    const rentalStatuses = new Set<string>()
    const paymentStatuses = new Set<string>()

    data.forEach((item: any) => {
      if (item.rentalStatus) rentalStatuses.add(item.rentalStatus)
      if (item.paymentStatus) paymentStatuses.add(item.paymentStatus)
    })

    return {
      rental: Array.from(rentalStatuses),
      payment: Array.from(paymentStatuses),
    }
  }, [data])

  return (
    <div>
      {/* filter */}
      <ScrollArea>
        <ScrollBar orientation="horizontal" />
        <div className="flex flex-col justify-between gap-4 p-2 sm:flex-row">
          <div className="flex flex-1 flex-wrap gap-2">
            <FloatingLabelInput
              id="filter-input"
              type="text"
              label={`${placeholder}`}
              placeholder={placeholder}
              disabled={disabled}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full p-5 shadow-xs sm:w-64"
            />

            {/* Advanced filter component */}
            {isLockerRental && (
              <AdvancedFilter
                advancedFilters={advancedFilters}
                setAdvancedFilters={setAdvancedFilters}
                statusOptions={statusOptions}
                onClearAllFilters={clearFilters}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="sm"
                variant="outline"
                className="font-normal text-xs shadow-xs"
              >
                <PrinterIcon className="mr-2 h-4 w-4" />
                Print
              </Button>
            </motion.div>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-normal text-xs shadow-xs"
                    >
                      <Settings2 className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </AnimatePresence>

            {/* Active filters counter */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="outline" className="ml-2">
                  {activeFilterCount}{" "}
                  {activeFilterCount === 1 ? "filter" : "filters"} active
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
      </ScrollArea>

      {data.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history records found"
          description="There are no history records tracked in the system yet."
          action={undefined}
        />
      ) : (
        <>
          <ScrollArea className="h-[calc(80vh-100px)] rounded-md border md:h-[calc(80vh-100px)]">
            <ScrollBar orientation="horizontal" />
            <Table className="relative">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <AnimatePresence mode="wait">
                <TableBody>
                  {memoizedRows.length > 0 ? (
                    memoizedRows.map((row) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={
                          row.getIsSelected() ? "bg-muted/50" : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </AnimatePresence>
            </Table>
          </ScrollArea>

          <div className="flex items-center justify-end space-x-2 py-4 max-sm:flex-col max-sm:justify-center">
            <div className="flex-1 text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            <div className="flex flex-row items-center justify-between gap-2 text-center max-sm:mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={true}
              >
                <ChevronLeft className="size-6" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={true}
              >
                <ChevronRight className="size-6" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
