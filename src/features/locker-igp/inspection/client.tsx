"use client"

import {
  InspectionFilters,
  useFindManyInspections,
} from "@/backend/actions/inspection/find-many"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { useCallback, useEffect, useMemo, useState } from "react"
import { inspectionColumn } from "./inspection-column"

export const InspectionClient = () => {
  const [filters, setFilters] = useState<InspectionFilters>({
    page: 1,
    limit: 10,
  })

  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearch = useDebounce(searchValue, 500)

  const finalFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
    }),
    [filters, debouncedSearch],
  )

  const {
    data: inspectionsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFindManyInspections(finalFilters)

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1, search: debouncedSearch }))
    }
  }, [debouncedSearch, filters.search])

  // Handler for updating filters
  const updateFilters = useCallback(
    (newFilters: Partial<InspectionFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        // Reset to page 1 if any filter other than page changes
        page:
          newFilters.page ??
          (Object.keys(newFilters).length > 1 ? 1 : prev.page),
      }))
    },
    [],
  )

  // Search handler
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  // Pagination handlers
  const goToPage = useCallback(
    (page: number) => updateFilters({ page }),
    [updateFilters],
  )

  const goToFirstPage = useCallback(() => goToPage(1), [goToPage])

  const goToLastPage = useCallback(() => {
    if (inspectionsResponse?.meta.totalPages) {
      goToPage(inspectionsResponse.meta.totalPages)
    }
  }, [goToPage, inspectionsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    const currentPage = filters.page || 1
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [goToPage, filters.page])

  const goToNextPage = useCallback(() => {
    const currentPage = filters.page || 1
    const totalPages = inspectionsResponse?.meta.totalPages || 1
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [goToPage, filters.page, inspectionsResponse?.meta.totalPages])

  const handlePageSizeChange = useCallback(
    (newLimit: number) => updateFilters({ limit: newLimit, page: 1 }),
    [updateFilters],
  )

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10 })
    setSearchValue("")
  }, [])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.startDate) count++
    if (filters.endDate) count++
    if (filters.sort) count++
    if (debouncedSearch) count++
    return count
  }, [filters.startDate, filters.endDate, filters.sort, debouncedSearch])

  if (isLoading) return <TableLoadingState />
  if (isError)
    return <TableErrorState error={error} onRetry={() => refetch()} />

  return (
    <div className="mt-2">
      <DataTable
        columns={inspectionColumn}
        data={inspectionsResponse?.data || []}
        placeholder="Search inspections..."
        isLoading={isFetching}
        isFetching={isFetching}
        onRefetch={refetch}
        isDynamic={true}
        // Search props
        searchValue={searchValue}
        onSearchChange={handleSearch}
        // Filter props
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFiltersCount}
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        onClose={() => setShowFilters(false)}
        // Pagination props
        totalItems={inspectionsResponse?.meta.totalItems || 0}
        currentDataLength={inspectionsResponse?.data.length || 0}
        currentPage={filters.page || 1}
        totalPages={inspectionsResponse?.meta.totalPages || 1}
        limit={filters.limit || 10}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={inspectionsResponse?.meta.hasNextPage || false}
        hasPrevPage={inspectionsResponse?.meta.hasPrevPage || false}
        onGoToFirstPage={goToFirstPage}
        onGoToPreviousPage={goToPreviousPage}
        onGoToNextPage={goToNextPage}
        onGoToLastPage={goToLastPage}
        onGoToPage={goToPage}
        resultLabel="inspections"
        filterType="inspection"
        isOnInspection={true}
      />
    </div>
  )
}
