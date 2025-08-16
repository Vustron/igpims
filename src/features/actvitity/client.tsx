"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ActivityFilters,
  useFindManyActivity,
} from "@/backend/actions/activity/find-many"
import { TableErrorState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { activityLogColumn } from "./activity-log-column"
import { ActivityLogSkeleton } from "./activity-log-skeleton"

interface ActivityLogClientProps {
  userId?: string
}

export const ActivityLogClient = ({ userId }: ActivityLogClientProps) => {
  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ActivityFilters>({
    page: 1,
    limit: 10,
    ...(userId && { userId }),
  })

  const debouncedSearch = useDebounce(searchValue, 500)

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
    }),
    [filters, debouncedSearch],
  )

  const {
    data: activityResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFindManyActivity(queryFilters)

  useEffect(() => {
    if (debouncedSearch !== undefined && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.search])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const handleUpdateFilters = useCallback(
    (newFilters: Partial<ActivityFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page ?? prev.page,
      }))
    },
    [],
  )

  const handleResetFilters = useCallback(() => {
    setSearchValue("")
    const baseFilters = { page: 1, limit: 10 }
    setFilters(userId ? { ...baseFilters, userId } : baseFilters)
  }, [userId])

  const handlePageSizeChange = useCallback((newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }))
  }, [])

  const handleGoToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const handleGoToFirstPage = useCallback(
    () => handleGoToPage(1),
    [handleGoToPage],
  )

  const handleGoToPreviousPage = useCallback(() => {
    const currentPage = filters.page || 1
    if (currentPage > 1) {
      handleGoToPage(currentPage - 1)
    }
  }, [handleGoToPage, filters.page])

  const handleGoToNextPage = useCallback(() => {
    const currentPage = filters.page || 1
    const totalPages = activityResponse?.meta.totalPages || 1
    if (currentPage < totalPages) {
      handleGoToPage(currentPage + 1)
    }
  }, [handleGoToPage, filters.page, activityResponse?.meta.totalPages])

  const handleGoToLastPage = useCallback(() => {
    const totalPages = activityResponse?.meta.totalPages || 1
    handleGoToPage(totalPages)
  }, [handleGoToPage, activityResponse?.meta.totalPages])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.startDate) count++
    if (filters.endDate) count++
    if (filters.userId && !userId) count++
    if (filters.action) count++
    if (debouncedSearch) count++
    return count
  }, [
    filters.startDate,
    filters.endDate,
    filters.userId,
    filters.action,
    debouncedSearch,
    userId,
  ])

  if (isLoading) {
    return <ActivityLogSkeleton />
  }

  if (isError) {
    return <TableErrorState error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="mt-2 space-y-4">
      <DataTable
        columns={activityLogColumn}
        data={activityResponse?.data || []}
        placeholder="Search activities..."
        isLoading={isLoading || isFetching}
        isDynamic={true}
        onRefetch={() => refetch()}
        isFetching={isFetching}
        filterType="activities"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFiltersCount}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        onClose={() => setShowFilters(false)}
        totalItems={activityResponse?.meta.totalItems || 0}
        currentDataLength={activityResponse?.data?.length || 0}
        currentPage={filters.page || 1}
        totalPages={activityResponse?.meta.totalPages || 1}
        limit={filters.limit || 10}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={activityResponse?.meta.hasNextPage || false}
        hasPrevPage={activityResponse?.meta.hasPrevPage || false}
        onGoToFirstPage={handleGoToFirstPage}
        onGoToPreviousPage={handleGoToPreviousPage}
        onGoToNextPage={handleGoToNextPage}
        onGoToLastPage={handleGoToLastPage}
        onGoToPage={handleGoToPage}
        resultLabel="activities"
      />
    </div>
  )
}
