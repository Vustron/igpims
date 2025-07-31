"use client"

import {
  WaterFundFilters,
  useFindManyWaterFunds,
} from "@/backend/actions/water-fund/find-many"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { useCallback, useEffect, useMemo, useState } from "react"
import { waterFundColumn } from "./water-fund-column"

export const WaterFundsClient = () => {
  const [filters, setFilters] = useState<WaterFundFilters>({
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
    data: fundsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFindManyWaterFunds(finalFilters)

  const transformedData = useMemo(
    () => fundsResponse?.data ?? [],
    [fundsResponse?.data],
  )

  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1, search: debouncedSearch }))
    }
  }, [debouncedSearch, filters.search])

  const updateFilters = useCallback((newFilters: Partial<WaterFundFilters>) => {
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
    if (fundsResponse?.meta.totalPages) {
      goToPage(fundsResponse.meta.totalPages)
    }
  }, [goToPage, fundsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    const currentPage = filters.page || 1
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [goToPage, filters.page])

  const goToNextPage = useCallback(() => {
    const currentPage = filters.page || 1
    const totalPages = fundsResponse?.meta.totalPages || 1
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [goToPage, filters.page, fundsResponse?.meta.totalPages])

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
    if (filters.vendoId) count++
    if (debouncedSearch) count++
    return count
  }, [filters.startDate, filters.endDate, filters.vendoId, debouncedSearch])

  if (isLoading) return <TableLoadingState />
  if (isError)
    return <TableErrorState error={error} onRetry={() => refetch()} />

  const currentPage = filters.page || 1
  const totalPages = fundsResponse?.meta.totalPages || 1
  const totalItems = fundsResponse?.meta.totalItems || 0
  const hasNextPage =
    fundsResponse?.meta.hasNextPage ?? currentPage < totalPages
  const hasPrevPage = fundsResponse?.meta.hasPrevPage ?? currentPage > 1

  return (
    <div className="mt-2">
      <DataTable
        columns={waterFundColumn}
        data={transformedData}
        placeholder="Search water funds..."
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
        currentDataLength={transformedData.length}
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
        filterType="water-funds"
        resultLabel="water funds"
        isOnWaterFund
      />
    </div>
  )
}
