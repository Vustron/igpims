"use client"

import { useFindManyIgp } from "@/backend/actions/igp/find-many"
import { Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import { ProjectRequestCard } from "./project-request-card"
import { ProjectRequestFilter } from "./project-request-filter"

type StatusOption =
  | "pending"
  | "in_review"
  | "checking"
  | "approved"
  | "in_progress"
  | "completed"
  | "rejected"
  | "all"

export const ProjectRequestClient = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as StatusOption,
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  })

  const { data: igpData, isLoading } = useFindManyIgp({
    search: filters.search,
    status: filters.status !== "all" ? filters.status : undefined,
    startDate: filters.dateRange.from?.toISOString(),
    endDate: filters.dateRange.to?.toISOString(),
  })

  const requests = igpData?.data || []
  const totalRequests = igpData?.meta.totalItems || 0

  const filteredRequests = useMemo(() => {
    return requests.sort((a, b) => {
      const dateA = new Date(a.requestDate ?? 0)
      const dateB = new Date(b.requestDate ?? 0)
      return dateB.getTime() - dateA.getTime()
    })
  }, [requests])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="mt-2 mb-6">
        <ProjectRequestFilter
          onFilterChange={(newFilters) => setFilters(newFilters)}
          requests={requests}
        />
      </div>

      {(filters.search ||
        filters.status !== "all" ||
        filters.dateRange.from ||
        filters.dateRange.to) && (
        <div className="mb-4 text-slate-600 text-sm">
          Showing {filteredRequests.length} of {totalRequests} project requests
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
