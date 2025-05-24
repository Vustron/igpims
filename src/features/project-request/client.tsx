"use client"

import { sampleProjectRequests } from "@/features/project-request/timeline-sample-data"
import { ProjectRequestFilter } from "@/features/project-request/project-request-filter"
import { ProjectRequestCard } from "@/features/project-request/project-request-card"

import { useState, useMemo } from "react"

export const ProjectRequestClient = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  })

  const filteredRequests = useMemo(() => {
    return sampleProjectRequests.filter((request) => {
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
      {/* Fund Request Filter */}
      <div className="mt-2 mb-6">
        <ProjectRequestFilter
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </div>

      {/* Display results count when filtering */}
      {(filters.search ||
        filters.status !== "all" ||
        filters.dateRange.from ||
        filters.dateRange.to) && (
        <div className="mb-4 text-slate-600 text-sm">
          Showing {filteredRequests.length} of {sampleProjectRequests.length}{" "}
          project requests
        </div>
      )}

      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <ProjectRequestCard key={request.id} projectRequest={request} />
        ))
      ) : (
        <div className="rounded-lg bg-slate-50 py-10 text-center">
          <h3 className="font-medium text-lg text-slate-700">
            No project requests found
          </h3>
          <p className="mt-1 text-slate-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
