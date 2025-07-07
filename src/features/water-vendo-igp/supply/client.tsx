"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import {
  useFindManyWaterSupplies,
  WaterSupplyFilters,
} from "@/backend/actions/water-supply/find-many"
import { useDebounce } from "@/hooks/use-debounce"
import { waterSupplyListColumn } from "./water-supply-column"

export const WaterSupplyClient = () => {
  const [filters, setFilters] = useState<WaterSupplyFilters>({
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
    error,
    refetch,
    isFetching,
  } = useFindManyWaterSupplies(finalFilters)

  const transformedData = useMemo(() => {
    if (!suppliesResponse?.data) return []

    return suppliesResponse.data.map((supply) => ({
      ...supply,
    }))
  }, [suppliesResponse?.data])

  useEffect(() => {
    if (debouncedSearch !== searchValue) return
    if (filters.page !== 1 && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.page, filters.search, searchValue])

  const updateFilters = useCallback(
    (newFilters: Partial<WaterSupplyFilters>) => {
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
    if (suppliesResponse?.meta.totalPages) {
      goToPage(suppliesResponse.meta.totalPages)
    }
  }, [goToPage, suppliesResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (suppliesResponse?.meta.hasPrevPage) {
      goToPage((filters.page ?? 1) - 1)
    }
  }, [goToPage, filters.page, suppliesResponse?.meta.hasPrevPage])

  const goToNextPage = useCallback(() => {
    if (suppliesResponse?.meta.hasNextPage) {
      goToPage((filters.page ?? 1) + 1)
    }
  }, [goToPage, filters.page, suppliesResponse?.meta.hasNextPage])

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
    if (filters.vendoId) count++
    if (debouncedSearch) count++
    return count
  }, [filters, debouncedSearch])

  if (isLoading) {
    return <TableLoadingState />
  }

  if (isError) {
    return <TableErrorState error={error} onRetry={() => refetch()} />
  }

  const currentPage = suppliesResponse?.meta.page || 1
  const totalPages = suppliesResponse?.meta.totalPages || 1
  const totalItems = suppliesResponse?.meta.totalItems || 0
  const hasNextPage = suppliesResponse?.meta.hasNextPage || false
  const hasPrevPage = suppliesResponse?.meta.hasPrevPage || false

  return (
    <div className="mt-2">
      <DataTable
        columns={waterSupplyListColumn}
        data={transformedData}
        placeholder="Search water supplies..."
        isLoading={isFetching}
        onRefetch={refetch}
        isFetching={isFetching}
        isDynamic={true}
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
        filterType="water-supplies"
        resultLabel="water supplies"
        isOnWaterSupply
      />
    </div>
  )
}
