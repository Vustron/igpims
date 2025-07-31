"use client"

import { useFindManyViolations } from "@/backend/actions/violation/find-many"
import type {
  ViolationFilters,
  ViolationWithRenters,
} from "@/backend/actions/violation/find-many"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { useCallback, useEffect, useMemo, useState } from "react"
import { violationListColumns } from "./violation-list-column"

export const ViolationClient = () => {
  const [filters, setFilters] = useState<ViolationFilters>({
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
    data: violationsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFindManyViolations(finalFilters)

  const transformedData = useMemo<ViolationWithRenters[]>(() => {
    if (!violationsResponse?.data) return []

    return violationsResponse.data
      .filter((violation) => violation.id)
      .map((violation) => ({
        id: violation.id!,
        lockerId: violation.lockerId,
        inspectionId: violation.inspectionId,
        studentName: violation.studentName,
        violations: Array.isArray(violation.violations)
          ? violation.violations
          : violation.violations
            ? [violation.violations]
            : [],
        dateOfInspection: violation.dateOfInspection,
        datePaid: violation.datePaid,
        totalFine: violation.totalFine,
        fineStatus: violation.fineStatus || "unpaid",
        createdAt: violation.createdAt,
        updatedAt: violation.updatedAt,
        renters: violation.renters,
      }))
  }, [violationsResponse?.data])

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1, search: debouncedSearch }))
    }
  }, [debouncedSearch, filters.search])

  const updateFilters = useCallback((newFilters: Partial<ViolationFilters>) => {
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
    if (violationsResponse?.meta.totalPages) {
      goToPage(violationsResponse.meta.totalPages)
    }
  }, [goToPage, violationsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    const currentPage = filters.page || 1
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [goToPage, filters.page])

  const goToNextPage = useCallback(() => {
    const currentPage = filters.page || 1
    const totalPages = violationsResponse?.meta.totalPages || 1
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [goToPage, filters.page, violationsResponse?.meta.totalPages])

  // Page size change handler
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
    if (filters.violationType) count++
    if (filters.fineStatus) count++
    if (filters.fromDate) count++
    if (filters.toDate) count++
    if (debouncedSearch) count++
    return count
  }, [
    filters.violationType,
    filters.fineStatus,
    filters.fromDate,
    filters.toDate,
    debouncedSearch,
  ])

  if (isLoading) return <TableLoadingState />
  if (isError)
    return <TableErrorState error={error} onRetry={() => refetch()} />

  const currentPage = filters.page || 1
  const totalPages = violationsResponse?.meta.totalPages || 1
  const totalItems = violationsResponse?.meta.totalItems || 0
  const hasNextPage =
    violationsResponse?.meta.hasNextPage ?? currentPage < totalPages
  const hasPrevPage = violationsResponse?.meta.hasPrevPage ?? currentPage > 1

  return (
    <div className="mt-2">
      <DataTable
        columns={violationListColumns}
        data={transformedData}
        placeholder="Search violations..."
        isLockerRental={true}
        isLoading={isFetching}
        isFetching={isFetching}
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
        filterType="violations"
        resultLabel="violations"
        isOnViolations
      />
    </div>
  )
}
