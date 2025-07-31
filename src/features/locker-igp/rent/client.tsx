"use client"

import {
  RentalFilters,
  useFindManyRentals,
} from "@/backend/actions/locker-rental/find-many"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { useCallback, useEffect, useMemo, useState } from "react"
import { lockerRentalListColumns } from "./locker-rental-list-columns"

export const LockerRentClient = () => {
  const [filters, setFilters] = useState<RentalFilters>({
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
    data: rentalsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFindManyRentals(finalFilters)

  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1, search: debouncedSearch }))
    }
  }, [debouncedSearch, filters.search])

  const updateFilters = useCallback((newFilters: Partial<RentalFilters>) => {
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
    if (rentalsResponse?.meta.totalPages) {
      goToPage(rentalsResponse.meta.totalPages)
    }
  }, [goToPage, rentalsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    const currentPage = filters.page || 1
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [goToPage, filters.page])

  const goToNextPage = useCallback(() => {
    const currentPage = filters.page || 1
    const totalPages = rentalsResponse?.meta.totalPages || 1
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [goToPage, filters.page, rentalsResponse?.meta.totalPages])

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
    if (filters.rentalStatus) count++
    if (filters.paymentStatus) count++
    if (filters.renterName) count++
    if (filters.courseAndSet) count++
    if (debouncedSearch) count++
    return count
  }, [
    filters.rentalStatus,
    filters.paymentStatus,
    filters.renterName,
    filters.courseAndSet,
    debouncedSearch,
  ])

  if (isLoading) return <TableLoadingState />

  if (isError)
    return <TableErrorState error={error} onRetry={() => refetch()} />

  return (
    <div className="mt-2">
      <DataTable
        columns={lockerRentalListColumns}
        data={rentalsResponse?.data || []}
        placeholder="Search rentals..."
        isLockerRental={true}
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
        totalItems={rentalsResponse?.meta.totalItems || 0}
        currentDataLength={rentalsResponse?.data.length || 0}
        currentPage={filters.page || 1}
        totalPages={rentalsResponse?.meta.totalPages || 1}
        limit={filters.limit || 10}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={rentalsResponse?.meta.hasNextPage || false}
        hasPrevPage={rentalsResponse?.meta.hasPrevPage || false}
        onGoToFirstPage={goToFirstPage}
        onGoToPreviousPage={goToPreviousPage}
        onGoToNextPage={goToNextPage}
        onGoToLastPage={goToLastPage}
        onGoToPage={goToPage}
        resultLabel="rentals"
      />
    </div>
  )
}
