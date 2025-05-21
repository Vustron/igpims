"use client"

import { FundRequestFilter } from "@/features/fund-request/fund-request-filter"
import { FundRequestCard } from "@/features/fund-request/fund-request-card"
import { Button } from "@/components/ui/buttons"
import { Plus } from "lucide-react"

import { sampleFundRequests } from "@/features/fund-request/timeline-sample-data"

import { useDialog } from "@/hooks/use-dialog"
import { useState, useMemo } from "react"

export const FundRequestClient = () => {
  const { onOpen } = useDialog()
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  })

  const filteredRequests = useMemo(() => {
    return sampleFundRequests.filter((request) => {
      if (
        filters.search &&
        !request.id.toLowerCase().includes(filters.search.toLowerCase()) &&
        !request.purpose.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      if (filters.status !== "all" && request.status !== filters.status) {
        return false
      }

      if (filters.dateRange.from || filters.dateRange.to) {
        const requestDate = new Date(request.requestDate)

        if (filters.dateRange.from && requestDate < filters.dateRange.from) {
          return false
        }

        if (filters.dateRange.to) {
          const endDate = new Date(filters.dateRange.to)
          endDate.setDate(endDate.getDate() + 1)

          if (requestDate > endDate) {
            return false
          }
        }
      }

      return true
    })
  }, [filters])

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          className="gap-2 shadow-sm transition-all hover:shadow"
          onClick={() => onOpen("createFundRequest")}
        >
          <Plus className="size-4" />
          <span className="whitespace-nowrap">New Fund Request</span>
        </Button>
      </div>

      {/* Fund Request Filter */}
      <div className="mb-6">
        <FundRequestFilter
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </div>

      {/* Display results count when filtering */}
      {(filters.search ||
        filters.status !== "all" ||
        filters.dateRange.from ||
        filters.dateRange.to) && (
        <div className="mb-4 text-slate-600 text-sm">
          Showing {filteredRequests.length} of {sampleFundRequests.length} fund
          requests
        </div>
      )}

      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <FundRequestCard key={request.id} fundRequest={request} />
        ))
      ) : (
        <div className="rounded-lg bg-slate-50 py-10 text-center">
          <h3 className="font-medium text-lg text-slate-700">
            No fund requests found
          </h3>
          <p className="mt-1 text-slate-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
