"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { TableErrorState, TableLoadingState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import {
  useFindManyViolations,
  ViolationFilters,
} from "@/backend/actions/violation/find-many"
import { Violation } from "@/backend/db/schemas"
import { useDebounce } from "@/hooks/use-debounce"
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

  const transformedData = useMemo(() => {
    if (!violationsResponse?.data) return []

    return violationsResponse.data
      .filter((violation) => violation.id)
      .map(
        (violation): Violation => ({
          id: violation.id!,
          lockerId: violation.lockerId,
          inspectionId: violation.inspectionId,
          studentName: violation.studentName,
          violations: Array.isArray(violation.violations)
            ? violation.violations
            : violation.violations
              ? [violation.violations]
              : [],
          dateOfInspection: new Date(violation.dateOfInspection),
          datePaid: violation.datePaid ? new Date(violation.datePaid) : null,
          totalFine: violation.totalFine,
          fineStatus: violation.fineStatus || "unpaid",
          createdAt: violation.createdAt
            ? new Date(violation.createdAt)
            : new Date(),
          updatedAt: violation.updatedAt
            ? new Date(violation.updatedAt)
            : new Date(),
        }),
      )
  }, [violationsResponse?.data])

  useEffect(() => {
    if (debouncedSearch !== searchValue) return
    if (filters.page !== 1 && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.page, filters.search, searchValue])

  const updateFilters = useCallback((newFilters: Partial<ViolationFilters>) => {
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
    if (violationsResponse?.meta.totalPages) {
      goToPage(violationsResponse.meta.totalPages)
    }
  }, [goToPage, violationsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (violationsResponse?.meta.hasPrevPage) {
      goToPage((filters.page ?? 1) - 1)
    }
  }, [goToPage, filters.page, violationsResponse?.meta.hasPrevPage])

  const goToNextPage = useCallback(() => {
    if (violationsResponse?.meta.hasNextPage) {
      goToPage((filters.page ?? 1) + 1)
    }
  }, [goToPage, filters.page, violationsResponse?.meta.hasNextPage])

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
    if (filters.violationType) count++
    if (filters.fineStatus) count++
    if (filters.fromDate) count++
    if (filters.toDate) count++
    if (debouncedSearch) count++
    return count
  }, [filters, debouncedSearch])

  if (isLoading) {
    return <TableLoadingState />
  }

  if (isError) {
    return <TableErrorState error={error} onRetry={() => refetch()} />
  }

  const currentPage = violationsResponse?.meta.currentPage || 1
  const totalPages = violationsResponse?.meta.totalPages || 1
  const totalItems = violationsResponse?.meta.totalItems || 0
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  return (
    <div className="mt-2">
      <DataTable
        columns={violationListColumns}
        data={transformedData}
        placeholder="Search violations..."
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
        currentDataLength={violationsResponse?.data.length || 0}
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
