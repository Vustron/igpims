"use client"

import { ProjectRequestFilter } from "@/features/project-request/project-request-filter"
import { ProjectRequestCard } from "@/features/project-request/project-request-card"

import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { useState, useMemo } from "react"

import type { ProjectRequest } from "@/features/project-request/project-request-store"

type StatusOption = ProjectRequest["status"] | "all"

export const ProjectRequestClient = () => {
  const { requests } = useProjectRequestStore()
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as StatusOption,
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  })

  const filteredRequests = useMemo(() => {
    return requests
      .filter((request) => {
        if (
          filters.search &&
          !request.id.toLowerCase().includes(filters.search.toLowerCase()) &&
          !request.purpose
            .toLowerCase()
            .includes(filters.search.toLowerCase()) &&
          !request.projectLead
            .toLowerCase()
            .includes(filters.search.toLowerCase()) &&
          !request.projectTitle
            .toLowerCase()
            .includes(filters.search.toLowerCase())
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
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdated)
        const dateB = new Date(b.lastUpdated)
        return dateB.getTime() - dateA.getTime()
      })
  }, [requests, filters])

  return (
    <div className="space-y-4">
      {/* Project Request Filter */}
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
          Showing {filteredRequests.length} of {requests.length} project
          requests
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
          <p className="mt-1 text-slate-500">
            Try adjusting your filters or create a new project request
          </p>
        </div>
      )}
    </div>
  )
}
