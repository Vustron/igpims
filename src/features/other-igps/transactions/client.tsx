"use client"

import {
  IgpTransactionFilters,
  useFindManyIgpTransaction,
} from "@/backend/actions/igp-transaction/find-many"
import { Badge } from "@/components/ui/badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import {
  Skeleton,
  TableErrorState,
  TableLoadingState,
} from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/utils/cn"
import { formatCurrency } from "@/utils/currency"
import { useCallback, useEffect, useMemo, useState } from "react"
import { igpManagementColumn } from "./igp-transactions-column"

export const IgpTransactionsClient = () => {
  const [filters, setFilters] = useState<IgpTransactionFilters>({
    page: 1,
    limit: 10,
  })
  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const debouncedSearch = useDebounce(searchValue, 500)

  // Memoized filters to prevent unnecessary re-renders
  const finalFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      itemReceived:
        (selectedStatus as "pending" | "received" | "cancelled") || undefined,
    }),
    [filters, debouncedSearch, selectedStatus],
  )

  // Data fetching with the final filters
  const {
    data: transactionsResponse,
    isLoading,
    isError,
    refetch,
    error,
    isFetching,
  } = useFindManyIgpTransaction(finalFilters)

  const isLoadingData = isLoading || isFetching

  const revenueSummary = useMemo(() => {
    if (!transactionsResponse?.data) {
      return {
        totalRevenue: 0,
        receivedRevenue: 0,
        pendingRevenue: 0,
        receivedPercentage: 0,
        receivedCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
        latestTransaction: null,
        totalQuantitySold: 0,
      }
    }

    const transactionsWithDates = transactionsResponse.data.map((item) => ({
      ...item,
      dateBought: new Date(Number(item.dateBought) * 1000),
    }))

    const receivedTransactions = transactionsWithDates.filter(
      (item) => item.itemReceived === "received",
    )
    const pendingTransactions = transactionsWithDates.filter(
      (item) => item.itemReceived === "pending",
    )
    const cancelledTransactions = transactionsWithDates.filter(
      (item) => item.itemReceived === "cancelled",
    )

    const calculateRevenue = (items: typeof transactionsWithDates) =>
      items.reduce((sum, item) => {
        const price = item.igpData?.costPerItem || 0
        return sum + price * item.quantity
      }, 0)

    const totalRevenue = calculateRevenue(
      transactionsWithDates.filter((item) => item.itemReceived !== "pending"),
    )
    const receivedRevenue = calculateRevenue(receivedTransactions)
    const pendingRevenue = calculateRevenue(pendingTransactions)

    const receivedPercentage =
      totalRevenue > 0 ? Math.round((receivedRevenue / totalRevenue) * 100) : 0

    const latestTransaction =
      transactionsWithDates.length > 0
        ? new Date(
            Math.max(
              ...transactionsWithDates.map((item) => item.dateBought.getTime()),
            ),
          )
        : null

    const totalQuantitySold = transactionsWithDates.reduce(
      (sum, item) => sum + item.quantity,
      0,
    )

    return {
      totalRevenue,
      receivedRevenue,
      pendingRevenue,
      receivedPercentage,
      receivedCount: receivedTransactions.length,
      pendingCount: pendingTransactions.length,
      cancelledCount: cancelledTransactions.length,
      latestTransaction,
      totalQuantitySold,
    }
  }, [transactionsResponse?.data])

  const handleStatusFilterChange = useCallback((status: string | null) => {
    setSelectedStatus((prev) => (prev === status ? null : status))
    setFilters((prev) => ({ ...prev, page: 1 }))
  }, [])

  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1, search: debouncedSearch }))
    }
  }, [debouncedSearch, filters.search])

  const updateFilters = useCallback(
    (newFilters: Partial<IgpTransactionFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page:
          newFilters.page ??
          (Object.keys(newFilters).length > 1 ? 1 : prev.page),
      }))
    },
    [],
  )

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const goToPage = useCallback(
    (page: number) => updateFilters({ page }),
    [updateFilters],
  )

  const goToFirstPage = useCallback(() => goToPage(1), [goToPage])

  const goToLastPage = useCallback(() => {
    if (transactionsResponse?.meta.totalPages) {
      goToPage(transactionsResponse.meta.totalPages)
    }
  }, [goToPage, transactionsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    const currentPage = filters.page || 1
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [goToPage, filters.page])

  const goToNextPage = useCallback(() => {
    const currentPage = filters.page || 1
    const totalPages = transactionsResponse?.meta.totalPages || 1
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [goToPage, filters.page, transactionsResponse?.meta.totalPages])

  const handlePageSizeChange = useCallback(
    (newLimit: number) => updateFilters({ limit: newLimit, page: 1 }),
    [updateFilters],
  )

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10 })
    setSearchValue("")
    setSelectedStatus(null)
  }, [])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedStatus) count++
    if (debouncedSearch) count++
    return count
  }, [selectedStatus, debouncedSearch])

  if (isLoading) return <TableLoadingState />

  if (isError)
    return <TableErrorState error={error} onRetry={() => refetch()} />

  const currentPage = filters.page || 1
  const totalPages = transactionsResponse?.meta.totalPages || 1
  const totalItems = transactionsResponse?.meta.totalItems || 0
  const hasNextPage =
    transactionsResponse?.meta.hasNextPage ?? currentPage < totalPages
  const hasPrevPage = transactionsResponse?.meta.hasPrevPage ?? currentPage > 1

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Revenue"
          subtitle="All"
          value={formatCurrency(revenueSummary.totalRevenue)}
          isLoading={isLoadingData}
          color="text-blue-600"
        />
        <SummaryCard
          title="Received Revenue"
          subtitle="Completed"
          value={formatCurrency(revenueSummary.receivedRevenue)}
          isLoading={isLoadingData}
          color="text-green-600"
        />
        <SummaryCard
          title="Pending Revenue"
          subtitle="Unpaid"
          value={formatCurrency(revenueSummary.pendingRevenue)}
          isLoading={isLoadingData}
          color="text-yellow-600"
        />
        <CompletionRateCard
          percentage={revenueSummary.receivedPercentage}
          isLoading={isLoadingData}
        />
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge
          label="All Transactions"
          count={totalItems}
          isActive={!selectedStatus}
          onClick={() => handleStatusFilterChange(null)}
          variant="subtle-info"
        />
        <StatusBadge
          label="Received"
          count={revenueSummary.receivedCount}
          isActive={selectedStatus === "received"}
          onClick={() => handleStatusFilterChange("received")}
          variant="subtle-success"
        />
        <StatusBadge
          label="Pending"
          count={revenueSummary.pendingCount}
          isActive={selectedStatus === "pending"}
          onClick={() => handleStatusFilterChange("pending")}
          variant="subtle-warning"
        />
        <StatusBadge
          label="Cancelled"
          count={revenueSummary.cancelledCount}
          isActive={selectedStatus === "cancelled"}
          onClick={() => handleStatusFilterChange("cancelled")}
          variant="subtle-danger"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={igpManagementColumn}
        data={transactionsResponse?.data || []}
        placeholder="Search transactions..."
        isLoading={isLoadingData}
        isFetching={isLoadingData}
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
        currentDataLength={transactionsResponse?.data.length || 0}
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
        filterType="igp-transactions"
        resultLabel="IGP transactions"
        isOnIgpTransaction
      />
    </div>
  )
}

const SummaryCard = ({
  title,
  subtitle,
  value,
  isLoading,
  color,
}: {
  title: string
  subtitle: string
  value: string
  isLoading: boolean
  color: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <span className="text-sm text-muted-foreground">{subtitle}</span>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-full" />
      ) : (
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      )}
    </CardContent>
  </Card>
)

const CompletionRateCard = ({
  percentage,
  isLoading,
}: {
  percentage: number
  isLoading: boolean
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
      <span className="text-sm text-muted-foreground">% Received</span>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-2 w-full" />
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">{percentage}%</div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </CardContent>
  </Card>
)

const StatusBadge = ({
  label,
  count,
  isActive,
  onClick,
  variant,
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  variant: string
}) => (
  <Badge
    variant={isActive ? (variant as any) : "outline"}
    className={cn(
      "cursor-pointer px-3 py-1",
      isActive &&
        {
          "subtle-info": "bg-blue-100 text-blue-800",
          "subtle-success": "bg-green-100 text-green-800",
          "subtle-warning": "bg-yellow-100 text-yellow-800",
          "subtle-danger": "bg-red-100 text-red-800",
        }[variant],
    )}
    onClick={onClick}
  >
    {label} ({count})
  </Badge>
)
