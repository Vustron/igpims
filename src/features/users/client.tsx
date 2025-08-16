"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { UserFilters, useFindManyUser } from "@/backend/actions/user/find-many"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { usersColumns } from "./users-column"

export const UsersClient = () => {
  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  })

  const debouncedSearch = useDebounce(searchValue, 500)

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      excludeCurrentUser: true,
    }),
    [filters, debouncedSearch],
  )

  const { data, isFetching, refetch, isLoading } = useFindManyUser(queryFilters)

  useEffect(() => {
    if (debouncedSearch !== undefined && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.search])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const handleUpdateFilters = useCallback(
    (newFilters: Partial<UserFilters>) => {
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
    setFilters({ page: 1, limit: 10 }) // Reset to default limit
  }, [])

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
    const totalPages = data?.meta.totalPages || 1
    if (currentPage < totalPages) {
      handleGoToPage(currentPage + 1)
    }
  }, [handleGoToPage, filters.page, data?.meta.totalPages])

  const handleGoToLastPage = useCallback(() => {
    const totalPages = data?.meta.totalPages || 1
    handleGoToPage(totalPages)
  }, [handleGoToPage, data?.meta.totalPages])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.role) count++
    if (debouncedSearch) count++
    return count
  }, [filters.role, debouncedSearch])

  return (
    <div className="mt-3">
      <DataTable
        columns={usersColumns}
        data={data?.data || []}
        placeholder="Search users by name or email..."
        isLoading={isLoading || isFetching}
        isDynamic={true}
        onRefetch={() => refetch()}
        isFetching={isFetching}
        filterType="user"
        // Search props
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        // Filter props
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFiltersCount={activeFiltersCount}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        onClose={() => setShowFilters(false)}
        // Pagination props
        totalItems={data?.meta.totalItems || 0}
        currentDataLength={data?.data?.length || 0}
        currentPage={filters.page || 1}
        totalPages={data?.meta.totalPages || 1}
        limit={filters.limit || 10}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={data?.meta.hasNextPage || false}
        hasPrevPage={data?.meta.hasPrevPage || false}
        onGoToFirstPage={handleGoToFirstPage}
        onGoToPreviousPage={handleGoToPreviousPage}
        onGoToNextPage={handleGoToNextPage}
        onGoToLastPage={handleGoToLastPage}
        onGoToPage={handleGoToPage}
        resultLabel="users"
        isOnUsers
      />
    </div>
  )
}
