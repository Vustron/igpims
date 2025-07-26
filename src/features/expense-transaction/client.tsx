"use client"

import {
  ExpenseTransactionFilters,
  useFindManyExpenseTransactions,
} from "@/backend/actions/expense-transaction/find-many"
import { useFindFundRequestById } from "@/backend/actions/fund-request/find-by-id"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import { Skeleton, TableErrorState } from "@/components/ui/fallbacks"
import { DataTable } from "@/components/ui/tables"
import { useDebounce } from "@/hooks/use-debounce"
import { useCallback, useEffect, useMemo, useState } from "react"
import { expenseTransactionListColumn } from "./expense-transaction-column"
import { ExpenseTransactionSkeleton } from "./expense-transaction-skeleton"

interface ExpenseTransactionClientProps {
  id: string
}

export const ExpenseTransactionClient = ({
  id,
}: ExpenseTransactionClientProps) => {
  const [filters, setFilters] = useState<ExpenseTransactionFilters>({
    page: 1,
    limit: 10,
  })

  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const { data: fundRequestData, isLoading: fundRequestLoading } =
    useFindFundRequestById(id)

  const debouncedSearch = useDebounce(searchValue, 500)

  const finalFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      requestId: id,
    }),
    [filters, debouncedSearch, id],
  )

  const {
    data: transactionsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFindManyExpenseTransactions(finalFilters)
  const isLoadingData = isLoading || fundRequestLoading || isFetching

  const transformedData = useMemo(() => {
    if (!transactionsResponse?.data) return []

    return transactionsResponse.data.map((transaction) => ({
      ...transaction,
      profitData: transactionsResponse.profitData,
    }))
  }, [transactionsResponse?.data])

  const totalExpenses = useMemo(() => {
    if (!transactionsResponse?.data) return 0
    return transactionsResponse.data.reduce(
      (sum, transaction) => sum + (transaction.amount || 0),
      0,
    )
  }, [transactionsResponse?.data])

  const allocatedFunds = fundRequestData?.allocatedFunds || 0
  const isBudgetFullyUtilized = totalExpenses >= allocatedFunds

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  useEffect(() => {
    if (debouncedSearch !== searchValue) return
    if (filters.page !== 1 && debouncedSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [debouncedSearch, filters.page, filters.search, searchValue])

  const updateFilters = useCallback(
    (newFilters: Partial<ExpenseTransactionFilters>) => {
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
  }, [])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.startDate) count++
    if (filters.endDate) count++
    if (filters.requestId) count++
    if (filters.id) count++
    if (filters.expenseName) count++
    if (debouncedSearch) count++
    return count
  }, [filters, debouncedSearch])

  if (isLoading || fundRequestLoading) {
    return <ExpenseTransactionSkeleton />
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
    <div className="mt-2 space-y-4">
      {/* Fund Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Allocated Funds
            </CardTitle>
            <span className="text-sm text-muted-foreground">Total</span>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(allocatedFunds)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <span className="text-sm text-muted-foreground">Used</span>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div
                className={`text-2xl font-bold ${totalExpenses > allocatedFunds ? "text-red-600" : "text-blue-600"}`}
              >
                {formatCurrency(totalExpenses)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Funds
            </CardTitle>
            <span className="text-sm text-muted-foreground">Balance</span>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div
                className={`text-2xl font-bold ${(allocatedFunds - totalExpenses) < 0 ? "text-red-600" : "text-gray-700"}`}
              >
                {formatCurrency(allocatedFunds - totalExpenses)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilization Rate
            </CardTitle>
            <span className="text-sm text-muted-foreground">% Used</span>
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
                  {allocatedFunds > 0
                    ? Math.round((totalExpenses / allocatedFunds) * 100)
                    : 0}
                  %
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${totalExpenses > allocatedFunds ? "bg-red-500" : "bg-blue-500"}`}
                    style={{
                      width: `${allocatedFunds > 0 ? Math.min(100, (totalExpenses / allocatedFunds) * 100) : 0}%`,
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        columns={expenseTransactionListColumn}
        data={transformedData}
        placeholder="Search expense transactions..."
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
        filterType="expense-transactions"
        resultLabel="expense transactions"
        isOnExpense={true}
        isBudgetFullyUtilized={isBudgetFullyUtilized}
        requestId={id}
      />
    </div>
  )
}
