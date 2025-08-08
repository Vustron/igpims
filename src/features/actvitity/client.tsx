"use client"

import {
  ActivityFilters,
  useFindManyActivity,
} from "@/backend/actions/activity/find-many"
import { TableErrorState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { useCallback, useEffect, useMemo, useState } from "react"
import { activityLogColumn } from "./activity-log-column"
import { ActivityLogSkeleton } from "./activity-log-skeleton"

interface ActivityLogClientProps {
  userId?: string
}

export const ActivityLogClient = ({ userId }: ActivityLogClientProps) => {
  const [filters, setFilters] = useState<ActivityFilters>({
    page: 1,
    limit: 10,
    ...(userId && { userId }),
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
    data: activityResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFindManyActivity(finalFilters)

  const isLoadingData = isLoading || isFetching

  const transformedData = useMemo(() => {
    if (!activityResponse?.data) return []
    return activityResponse.data
  }, [activityResponse?.data])

  useEffect(() => {
    if (debouncedSearch !== searchValue) return
    if (filters.page !== 1 && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.page, filters.search, searchValue])

  const updateFilters = useCallback((newFilters: Partial<ActivityFilters>) => {
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
    if (activityResponse?.meta.totalPages) {
      goToPage(activityResponse.meta.totalPages)
    }
  }, [goToPage, activityResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (activityResponse?.meta.hasPrevPage) {
      goToPage((filters.page ?? 1) - 1)
    }
  }, [goToPage, filters.page, activityResponse?.meta.hasPrevPage])

  const goToNextPage = useCallback(() => {
    if (activityResponse?.meta.hasNextPage) {
      goToPage((filters.page ?? 1) + 1)
    }
  }, [goToPage, filters.page, activityResponse?.meta.hasNextPage])

  const handlePageSizeChange = useCallback(
    (newLimit: number) => {
      updateFilters({ limit: newLimit, page: 1 })
    },
    [updateFilters],
  )

  const resetFilters = useCallback(() => {
    const baseFilters = { page: 1, limit: 10 }
    setFilters(userId ? { ...baseFilters, userId } : baseFilters)
    setSearchValue("")
  }, [userId])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.startDate) count++
    if (filters.endDate) count++
    if (filters.userId && !userId) count++
    if (filters.action) count++
    if (debouncedSearch) count++
    return count
  }, [filters, debouncedSearch, userId])

  if (isLoading) {
    return <ActivityLogSkeleton />
  }

  if (isError) {
    return <TableErrorState error={error} onRetry={() => refetch()} />
  }

  const currentPage = activityResponse?.meta.page || 1
  const totalPages = activityResponse?.meta.totalPages || 1
  const totalItems = activityResponse?.meta.totalItems || 0
  const hasNextPage = activityResponse?.meta.hasNextPage || false
  const hasPrevPage = activityResponse?.meta.hasPrevPage || false

  return (
    <div className="mt-2 space-y-4">
      <DataTable
        columns={activityLogColumn}
        data={transformedData}
        placeholder="Search activities..."
        isLoading={isLoadingData}
        onRefetch={refetch}
        isFetching={isLoadingData}
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
        currentDataLength={activityResponse?.data.length || 0}
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
        filterType="activities"
        resultLabel="activities"
      />
    </div>
  )
}
