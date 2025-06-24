"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import {
  InspectionFilters,
  useFindManyInspections,
} from "@/backend/actions/inspection/find-many"
import { useDebounce } from "@/hooks/use-debounce"
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

  useEffect(() => {
    if (debouncedSearch !== searchValue) return
    if (filters.page !== 1 && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.page, filters.search, searchValue])

  const updateFilters = useCallback(
    (newFilters: Partial<InspectionFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page:
          newFilters.page ??
          (Object.keys(newFilters).some((key) => key !== "page")
            ? 1
            : prev.page),
      }))
    },
    [],
  )

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const goToPage = useCallback(
    (page: number) => {
      updateFilters({ page })
    },
    [updateFilters],
  )

  const goToFirstPage = useCallback(() => goToPage(1), [goToPage])
  const goToLastPage = useCallback(() => {
    if (inspectionsResponse?.meta.totalPages) {
      goToPage(inspectionsResponse.meta.totalPages)
    }
  }, [goToPage, inspectionsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (inspectionsResponse?.meta.hasPrevPage) {
      goToPage((filters.page ?? 1) - 1)
    }
  }, [goToPage, filters.page, inspectionsResponse?.meta.hasPrevPage])

  const goToNextPage = useCallback(() => {
    if (inspectionsResponse?.meta.hasNextPage) {
      goToPage((filters.page ?? 1) + 1)
    }
  }, [goToPage, filters.page, inspectionsResponse?.meta.hasNextPage])

  const handlePageSizeChange = useCallback(
    (newLimit: number) => {
      updateFilters({ limit: newLimit, page: 1 })
    },
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
  }, [filters, debouncedSearch])

  if (isLoading) {
    return <TableLoadingState />
  }

  if (isError) {
    return <TableErrorState error={error} onRetry={() => refetch()} />
  }

  const currentPage = inspectionsResponse?.meta.page || 1
  const totalPages = inspectionsResponse?.meta.totalPages || 1
  const totalItems = inspectionsResponse?.meta.totalItems || 0
  const hasNextPage = inspectionsResponse?.meta.hasNextPage || false
  const hasPrevPage = inspectionsResponse?.meta.hasPrevPage || false

  return (
    <div className="mt-2">
      <DataTable
        columns={inspectionColumn}
        data={inspectionsResponse?.data || []}
        placeholder="Search inspections..."
        isLoading={isFetching}
        onRefetch={refetch}
        isFetching={isFetching}
        isDynamic={true}
        // Dynamic props
        searchValue={searchValue}
        onSearchChange={handleSearch}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFiltersCount}
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        onClose={() => setShowFilters(false)}
        totalItems={totalItems}
        currentDataLength={inspectionsResponse?.data.length || 0}
        currentPage={currentPage}
        totalPages={totalPages}
        limit={filters.limit || 10}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
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
