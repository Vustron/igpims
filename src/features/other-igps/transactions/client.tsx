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

  const finalFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      itemReceived:
        (selectedStatus as "pending" | "received" | "cancelled") || undefined,
    }),
    [filters, debouncedSearch, selectedStatus],
  )

  const {
    data: transactionsResponse,
    isLoading,
    isError,
    error,
    refetch,
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
        latestTransaction: null,
        totalQuantitySold: 0,
      }
    }

    const transactionsWithDates = transactionsResponse.data.map((item) => ({
      ...item,
      dateBought: new Date(Number(item.dateBought) * 1000),
    }))

    const totalRevenue = transactionsWithDates
      .filter((item) => item.itemReceived !== "pending")
      .reduce((sum, item) => {
        const price = item.igpData?.costPerItem || 0
        return sum + price * item.quantity
      }, 0)

    const receivedRevenue = transactionsWithDates
      .filter((item) => item.itemReceived === "received")
      .reduce((sum, item) => {
        const price = item.igpData?.costPerItem || 0
        return sum + price * item.quantity
      }, 0)

    const pendingRevenue = transactionsWithDates
      .filter((item) => item.itemReceived === "pending")
      .reduce((sum, item) => {
        const price = item.igpData?.costPerItem || 0
        return sum + price * item.quantity
      }, 0)

    const receivedPercentage =
      totalRevenue > 0 ? Math.round((receivedRevenue / totalRevenue) * 100) : 0

    const receivedCount = transactionsWithDates.filter(
      (item) => item.itemReceived === "received",
    ).length

    const pendingCount = transactionsWithDates.filter(
      (item) => item.itemReceived === "pending",
    ).length

    const cancelledCount = transactionsWithDates.filter(
      (item) => item.itemReceived === "cancelled",
    ).length

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
      receivedCount,
      pendingCount,
      cancelledCount,
      latestTransaction,
      totalQuantitySold,
    }
  }, [transactionsResponse?.data])

  const handleStatusFilterChange = (status: string | null) => {
    setSelectedStatus(status === selectedStatus ? null : status)
  }

  useEffect(() => {
    if (debouncedSearch !== searchValue) return
    if (filters.page !== 1 && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.page, filters.search, searchValue])

  const updateFilters = useCallback(
    (newFilters: Partial<IgpTransactionFilters>) => {
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
    if (transactionsResponse?.meta.totalPages) {
      goToPage(transactionsResponse.meta.totalPages)
    }
  }, [goToPage, transactionsResponse?.meta.totalPages])

  const goToPreviousPage = useCallback(() => {
    if (transactionsResponse?.meta.hasPrevPage) {
      goToPage((filters.page ?? 1) - 1)
    }
  }, [goToPage, filters.page, transactionsResponse?.meta.hasPrevPage])

  const goToNextPage = useCallback(() => {
    if (transactionsResponse?.meta.hasNextPage) {
      goToPage((filters.page ?? 1) + 1)
    }
  }, [goToPage, filters.page, transactionsResponse?.meta.hasNextPage])

  const handlePageSizeChange = useCallback(
    (newLimit: number) => {
      updateFilters({ limit: newLimit, page: 1 })
    },
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return <TableLoadingState />
  }

  if (isError) {
    return <TableErrorState error={error} onRetry={() => refetch()} />
  }

  const currentPage = transactionsResponse?.meta.page || 1
  const totalPages = transactionsResponse?.meta.totalPages || 1
  const totalItems = transactionsResponse?.meta.totalItems || 0
  const hasNextPage = transactionsResponse?.meta.hasNextPage || false
  const hasPrevPage = transactionsResponse?.meta.hasPrevPage || false

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-sm text-muted-foreground">All</span>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(revenueSummary.totalRevenue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Received Revenue
            </CardTitle>
            <span className="text-sm text-muted-foreground">Completed</span>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueSummary.receivedRevenue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Revenue
            </CardTitle>
            <span className="text-sm text-muted-foreground">Unpaid</span>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(revenueSummary.pendingRevenue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <span className="text-sm text-muted-foreground">% Received</span>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-2 w-full" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {revenueSummary.receivedPercentage}%
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${revenueSummary.receivedPercentage}%`,
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2">
        <Badge
          variant={!selectedStatus ? "subtle-info" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1",
            !selectedStatus && "bg-blue-100 text-blue-800",
          )}
          onClick={() => handleStatusFilterChange(null)}
        >
          All Transactions ({totalItems})
        </Badge>
        <Badge
          variant={selectedStatus === "received" ? "subtle-success" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1",
            selectedStatus === "received" && "bg-green-100 text-green-800",
          )}
          onClick={() => handleStatusFilterChange("received")}
        >
          Received ({revenueSummary.receivedCount})
        </Badge>
        <Badge
          variant={selectedStatus === "pending" ? "subtle-warning" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1",
            selectedStatus === "pending" && "bg-yellow-100 text-yellow-800",
          )}
          onClick={() => handleStatusFilterChange("pending")}
        >
          Pending ({revenueSummary.pendingCount})
        </Badge>
        <Badge
          variant={selectedStatus === "pending" ? "subtle-warning" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1",
            selectedStatus === "pending" && "bg-red-100 text-red-800",
          )}
          onClick={() => handleStatusFilterChange("cancelled")}
        >
          Cancelled ({revenueSummary.cancelledCount})
        </Badge>
      </div>

      {/* Data Table */}
      <DataTable
        columns={igpManagementColumn}
        data={transactionsResponse?.data || []}
        placeholder="Search transactions..."
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
