"use client"

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import { History } from "lucide-react"
import { useMemo, useState } from "react"
import { EmptyState, Skeleton } from "@/components/ui/fallbacks"
import { ScrollArea, ScrollBar } from "@/components/ui/scrollareas"
import {
  DynamicFiltersPanel,
  DynamicPaginationControls,
  DynamicResultsSummary,
  DynamicSearchHeader,
  StaticFilter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tables"
import { TableActions } from "@/components/ui/tables/table-actions"
import { deepSearch } from "@/utils/deep-search"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  placeholder: string
  disabled?: boolean
  isLockerRental?: boolean
  isIgp?: boolean
  isLoading?: boolean
  isDynamic?: boolean
  onRefetch?: () => void
  isFetching?: boolean
  // Dynamic props
  searchValue?: string
  onSearchChange?: (value: string) => void
  showFilters?: boolean
  onToggleFilters?: () => void
  activeFiltersCount?: number
  filters?: any
  onUpdateFilters?: (filters: any) => void
  onResetFilters?: () => void
  onClose?: () => void
  totalItems?: number
  currentDataLength?: number
  currentPage?: number
  totalPages?: number
  limit?: number
  onPageSizeChange?: (limit: number) => void
  hasNextPage?: boolean
  hasPrevPage?: boolean
  onGoToFirstPage?: () => void
  onGoToPreviousPage?: () => void
  onGoToNextPage?: () => void
  onGoToLastPage?: () => void
  onGoToPage?: (page: number) => void
  isOnUsers?: boolean
  filterType?: "rental" | "user" | "violations"
  resultLabel?: string
  isOnViolations?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder,
  disabled,
  isLockerRental,
  isIgp,
  isLoading,
  isDynamic,
  onRefetch,
  isFetching,
  // Dynamic props
  searchValue = "",
  onSearchChange,
  showFilters = false,
  onToggleFilters,
  activeFiltersCount = 0,
  filters,
  onUpdateFilters,
  onResetFilters,
  onClose,
  totalItems = 0,
  currentDataLength = 0,
  currentPage = 1,
  totalPages = 1,
  limit = 10,
  onPageSizeChange,
  hasNextPage = false,
  hasPrevPage = false,
  onGoToFirstPage,
  onGoToPreviousPage,
  onGoToNextPage,
  onGoToLastPage,
  onGoToPage,
  filterType,
  resultLabel,
  isOnUsers,
  isOnViolations,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [filterValue, setFilterValue] = useState<string>("")

  const filteredData = useMemo(() => {
    if (isDynamic) {
      return data
    }
    return data.filter((item) => deepSearch(item, filterValue))
  }, [data, filterValue, isDynamic])

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

  if (isDynamic) {
    return (
      <div className="space-y-4">
        {/* Dynamic Search Header */}
        {onSearchChange && onToggleFilters && (
          <DynamicSearchHeader
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={placeholder}
            onToggleFilters={onToggleFilters}
            activeFiltersCount={activeFiltersCount}
            onRefetch={onRefetch!}
            isFetching={isFetching!}
            isIgp={isIgp}
            isLockerRental={isLockerRental}
            table={table}
            isUser={isOnUsers}
            isOnViolations={isOnViolations}
          />
        )}

        {/* Dynamic Filters Panel */}
        {showFilters &&
          filters &&
          onUpdateFilters &&
          onResetFilters &&
          onClose && (
            <DynamicFiltersPanel
              filters={filters}
              activeFiltersCount={activeFiltersCount}
              onUpdateFilters={onUpdateFilters!}
              onResetFilters={onResetFilters!}
              onClose={onClose!}
              filterType={filterType}
            />
          )}

        {/* Dynamic Results Summary */}
        {onPageSizeChange && (
          <DynamicResultsSummary
            totalItems={totalItems}
            currentDataLength={currentDataLength}
            activeFiltersCount={activeFiltersCount}
            currentPage={currentPage}
            totalPages={totalPages}
            limit={limit}
            onPageSizeChange={onPageSizeChange}
            resultLabel={resultLabel!}
          />
        )}

        {/* Data Table */}
        {data.length === 0 ? (
          <EmptyState
            icon={History}
            title="No records found"
            description="There are no records to display at the moment."
            action={undefined}
          />
        ) : (
          <ScrollArea className="h-[calc(80vh-100px)] rounded-md border md:h-[calc(80vh-100px)]">
            <ScrollBar orientation="horizontal" className="z-10" />
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
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        {columns.map((_, colIndex) => (
                          <TableCell key={`skeleton-cell-${colIndex}`}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : memoizedRows.length > 0 ? (
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
        )}

        {/* Dynamic Pagination */}
        {onGoToPage &&
          onGoToFirstPage &&
          onGoToPreviousPage &&
          onGoToNextPage &&
          onGoToLastPage && (
            <DynamicPaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              isFetching={isFetching!}
              onGoToFirstPage={onGoToFirstPage}
              onGoToPreviousPage={onGoToPreviousPage}
              onGoToNextPage={onGoToNextPage}
              onGoToLastPage={onGoToLastPage}
              onGoToPage={onGoToPage}
            />
          )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StaticFilter
          placeholder={placeholder}
          disabled={disabled}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          table={table}
        />

        <TableActions
          isIgp={isIgp}
          isLockerRental={isLockerRental}
          onRefetch={onRefetch!}
          isFetching={isFetching!}
          table={table}
        />
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history records found"
          description="There are no history records tracked in the system yet."
          action={undefined}
        />
      ) : (
        <ScrollArea className="h-[calc(80vh-100px)] rounded-md border md:h-[calc(80vh-100px)]">
          <ScrollBar orientation="horizontal" className="z-10" />
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
                {isLoading ? (
                  // Loading skeleton rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={`skeleton-cell-${colIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : memoizedRows.length > 0 ? (
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
      )}
    </div>
  )
}
