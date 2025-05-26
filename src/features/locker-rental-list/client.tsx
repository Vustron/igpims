"use client"

import { DataTable } from "@/components/ui/tables"
import { lockerRentalListColumns } from "@/features/locker-rental-list/locker-rental-list-columns"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"

import { useFindManyRentals } from "@/backend/actions/locker-rental/find-many"
import { useState, useMemo, useCallback, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"

import type { RentalFilters } from "@/backend/actions/locker-rental/find-many"

export const LockerRentalListClient = () => {
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
    if (debouncedSearch !== searchValue) return
    if (filters.page !== 1 && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.page, filters.search, searchValue])

  const updateFilters = useCallback((newFilters: Partial<RentalFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page:
        newFilters.page ??
        (Object.keys(newFilters).some((key) => key !== "page") ? 1 : prev.page),
    }))
  }, [])

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
    if (rentalsResponse?.meta.totalPages) {
      goToPage(rentalsResponse.meta.totalPages)
    }
  }, [goToPage, rentalsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (rentalsResponse?.meta.hasPrevPage) {
      goToPage((filters.page ?? 1) - 1)
    }
  }, [goToPage, filters.page, rentalsResponse?.meta.hasPrevPage])

  const goToNextPage = useCallback(() => {
    if (rentalsResponse?.meta.hasNextPage) {
      goToPage((filters.page ?? 1) + 1)
    }
  }, [goToPage, filters.page, rentalsResponse?.meta.hasNextPage])

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
    if (filters.rentalStatus) count++
    if (filters.paymentStatus) count++
    if (filters.renterName) count++
    if (filters.courseAndSet) count++
    if (debouncedSearch) count++
    return count
  }, [filters, debouncedSearch])

  if (isLoading) {
    return <TableLoadingState />
  }

  if (isError) {
    return <TableErrorState error={error} onRetry={() => refetch()} />
  }

  const currentPage = rentalsResponse?.meta.page || 1
  const totalPages = rentalsResponse?.meta.totalPages || 1
  const totalItems = rentalsResponse?.meta.totalItems || 0
  const hasNextPage = rentalsResponse?.meta.hasNextPage || false
  const hasPrevPage = rentalsResponse?.meta.hasPrevPage || false

  return (
    <div className="mt-2">
      <DataTable
        columns={lockerRentalListColumns}
        data={rentalsResponse?.data || []}
        placeholder="Search rentals..."
        isLockerRental={true}
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
        currentDataLength={rentalsResponse?.data.length || 0}
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
        resultLabel="rentals"
      />
    </div>
  )
}
