"use client"

import { useFindManyFundRequests } from "@/backend/actions/fund-request/find-many"
import { FundRequest } from "@/backend/db/schemas"
import { Button } from "@/components/ui/buttons"
import { motion } from "framer-motion"
import { useState } from "react"
import { FundRequestCard } from "./fund-request-card"
import { FundRequestFilter } from "./fund-request-filter"
import { FundRequestSkeleton } from "./fund-request-skeleton"

export const FundRequestClient = ({ isSidebarOpen = false }) => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [filters, setFilters] = useState<{
    search: string
    status: "all" | FundRequest["status"]
    startDate?: string
    endDate?: string
  }>({
    search: "",
    status: "all",
    startDate: undefined,
    endDate: undefined,
  })

  const {
    data: fundRequestsResponse,
    isLoading,
    error,
  } = useFindManyFundRequests({
    page,
    limit,
    search: filters.search || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
  })

  const statusCounts = {
    all: fundRequestsResponse?.meta.totalItems || 0,
    pending:
      fundRequestsResponse?.data.filter((r) => r.status === "pending").length ||
      0,
    in_review:
      fundRequestsResponse?.data.filter((r) => r.status === "in_review")
        .length || 0,
    checking:
      fundRequestsResponse?.data.filter((r) => r.status === "checking")
        .length || 0,
    approved:
      fundRequestsResponse?.data.filter((r) => r.status === "approved")
        .length || 0,
    disbursed:
      fundRequestsResponse?.data.filter((r) => r.status === "disbursed")
        .length || 0,
    received:
      fundRequestsResponse?.data.filter((r) => r.status === "received")
        .length || 0,
    receipted:
      fundRequestsResponse?.data.filter((r) => r.status === "receipted")
        .length || 0,
    validated:
      fundRequestsResponse?.data.filter((r) => r.status === "validated")
        .length || 0,
    rejected:
      fundRequestsResponse?.data.filter((r) => r.status === "rejected")
        .length || 0,
  }

  const containerPadding = isSidebarOpen
    ? "p-2 sm:p-2 md:p-3 lg:p-4"
    : "p-2 sm:p-3 md:p-4 lg:p-6"

  const handleFilterChange = (newFilters: {
    search?: string
    status?: "all" | FundRequest["status"]
    startDate?: string
    endDate?: string
  }) => {
    setPage(1)
    setFilters({
      search: newFilters.search || "",
      status: (newFilters.status || "all") as "all" | FundRequest["status"],
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
    })
  }

  if (isLoading) {
    return <FundRequestSkeleton isSidebarOpen={isSidebarOpen} />
  }

  return (
    <div
      className={`-mt-5 flex min-h-screen w-full flex-col ${containerPadding}`}
    >
      <FundRequestFilter
        onFilterChange={handleFilterChange}
        statusCounts={statusCounts}
        isSidebarOpen={isSidebarOpen}
        fundRequest={
          fundRequestsResponse?.data[0]
            ? {
                ...fundRequestsResponse.data[0],
                users: fundRequestsResponse.users,
              }
            : undefined
        }
      />

      {error && (
        <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-center font-medium text-red-600">
            Error loading fund requests
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && fundRequestsResponse && (
        <>
          {(filters.search ||
            filters.status !== "all" ||
            filters.startDate ||
            filters.endDate) && (
            <div className="mb-4 text-sm text-slate-600">
              Showing {fundRequestsResponse.data.length} of{" "}
              {fundRequestsResponse.meta.totalItems} fund requests
            </div>
          )}

          {fundRequestsResponse.data.length > 0 ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {[...fundRequestsResponse.data]
                .sort((a, b) => {
                  if (a.status === "pending" && b.status !== "pending")
                    return -1
                  if (a.status !== "pending" && b.status === "pending") return 1
                  return 0
                })
                .map((request) => (
                  <FundRequestCard
                    key={request.id}
                    fundRequest={{
                      ...request,
                      users: fundRequestsResponse.users,
                    }}
                    isSelected={selectedRequest === request.id}
                    onSelect={() =>
                      setSelectedRequest(
                        selectedRequest === request.id ? null : request.id,
                      )
                    }
                  />
                ))}
            </motion.div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-3 sm:p-4">
              <p className="mb-2 text-center text-lg font-medium sm:text-xl">
                No fund requests found
              </p>
              <p className="text-center text-xs text-muted-foreground sm:text-sm">
                Try changing your search or filter criteria
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() =>
                  handleFilterChange({
                    search: "",
                    status: "all",
                    startDate: undefined,
                    endDate: undefined,
                  })
                }
              >
                Reset filters
              </Button>
            </div>
          )}

          {fundRequestsResponse.meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!fundRequestsResponse.meta.hasPrevPage}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-2">
                Page {fundRequestsResponse.meta.page} of{" "}
                {fundRequestsResponse.meta.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!fundRequestsResponse.meta.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
