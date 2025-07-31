"use client"

import {
  IgpSupplyFilters,
  useFindManyIgpSupply,
} from "@/backend/actions/igp-supply/find-many"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { useCallback, useEffect, useMemo, useState } from "react"
import { igpSupplyColumns } from "./igp-supply-column"

export const IgpSupplyClient = () => {
  const [filters, setFilters] = useState<IgpSupplyFilters>({
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
    data: suppliesResponse,
    isLoading,
    isError,
    refetch,
    error,
    isFetching,
  } = useFindManyIgpSupply(finalFilters)

  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1, search: debouncedSearch }))
    }
  }, [debouncedSearch, filters.search])

  const updateFilters = useCallback((newFilters: Partial<IgpSupplyFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page:
        newFilters.page ?? (Object.keys(newFilters).length > 1 ? 1 : prev.page),
    }))
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const goToPage = useCallback(
    (page: number) => updateFilters({ page }),
    [updateFilters],
  )

  const goToFirstPage = useCallback(() => goToPage(1), [goToPage])

  const goToLastPage = useCallback(() => {
    if (suppliesResponse?.meta.totalPages) {
      goToPage(suppliesResponse.meta.totalPages)
    }
  }, [goToPage, suppliesResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    const currentPage = filters.page || 1
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [goToPage, filters.page])

  const goToNextPage = useCallback(() => {
    const currentPage = filters.page || 1
    const totalPages = suppliesResponse?.meta.totalPages || 1
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [goToPage, filters.page, suppliesResponse?.meta.totalPages])

  // Page size change handler
  const handlePageSizeChange = useCallback(
    (newLimit: number) => updateFilters({ limit: newLimit, page: 1 }),
    [updateFilters],
  )

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10 })
    setSearchValue("")
  }, [])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.igpId) count++
    if (filters.startDate) count++
    if (filters.endDate) count++
    if (debouncedSearch) count++
    return count
  }, [filters.igpId, filters.startDate, filters.endDate, debouncedSearch])

  if (isLoading) return <TableLoadingState />

  if (isError)
    return <TableErrorState error={error} onRetry={() => refetch()} />

  const currentPage = filters.page || 1
  const totalPages = suppliesResponse?.meta.totalPages || 1
  const totalItems = suppliesResponse?.meta.totalItems || 0
  const hasNextPage =
    suppliesResponse?.meta.hasNextPage ?? currentPage < totalPages
  const hasPrevPage = suppliesResponse?.meta.hasPrevPage ?? currentPage > 1

  return (
    <div className="space-y-6">
      <DataTable
        columns={igpSupplyColumns}
        data={suppliesResponse?.data || []}
        placeholder="Search supplies..."
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
        totalItems={totalItems}
        currentDataLength={suppliesResponse?.data.length || 0}
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
        filterType="igp-supplies"
        resultLabel="igp-supplies"
        isOnIgpSupplies={true}
      />
    </div>
  )
}
