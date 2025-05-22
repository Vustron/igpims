"use client"

import { TimelineStatusBadge } from "@/features/project-request/timeline-status"
import { timelineSteps } from "@/features/project-request/timeline-sample-data"
import { ChevronDown, ChevronUp, XCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/cards"
import { Timeline } from "@/features/project-request/timeline"
import { Button } from "@/components/ui/buttons"

import { format } from "date-fns"

import { useState } from "react"

import type { ProjectRequest } from "@/features/project-request/timeline-sample-data"

export const ProjectRequestCard = ({
  projectRequest,
}: { projectRequest: ProjectRequest }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-4 w-full overflow-hidden border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <CardHeader className="p-3 sm:p-4 sm:pb-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {/* ID */}
          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Project ID</p>
            <p className="truncate font-medium text-sm">{projectRequest.id}</p>
          </div>

          {/* Project Lead */}
          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Project Lead</p>
            <p className="truncate font-medium text-sm">
              {projectRequest.requestor}
            </p>
          </div>

          {/* Project Title */}
          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Project Title</p>
            <p className="truncate font-medium text-sm">
              {projectRequest.projectTitle || projectRequest.purpose}
            </p>
          </div>

          {/* Date Submitted */}
          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Date Submitted</p>
            <p className="flex items-center gap-1 truncate font-medium text-sm">
              <Calendar className="size-3.5 text-slate-400" />
              {format(projectRequest.requestDate, "MMM d, yyyy")}
            </p>
          </div>

          {/* Status */}
          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Status</p>
            <div className="flex items-center gap-2">
              <TimelineStatusBadge status={projectRequest.status} />
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto size-6 sm:hidden"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Rejection reason (if rejected) */}
        {projectRequest.isRejected && projectRequest.rejectionReason && (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-red-50 p-2 text-red-700">
            <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
            <div>
              <p className="font-medium text-sm">Rejected</p>
              <p className="text-xs">{projectRequest.rejectionReason}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-3 sm:p-4 sm:pt-2">
        {/* Timeline for desktop */}
        <div className="mb-3 hidden rounded-md bg-slate-50 p-4 sm:block">
          <Timeline
            currentStep={projectRequest.currentStep}
            steps={timelineSteps}
            isRejected={projectRequest.isRejected}
            rejectionStep={projectRequest.rejectionStep}
          />
        </div>

        {/* Timeline for mobile */}
        <div className="mb-3 rounded-md bg-slate-50 p-3 sm:hidden">
          <div className="flex flex-col">
            <Timeline
              currentStep={projectRequest.currentStep}
              isMobile={true}
              steps={timelineSteps}
              isRejected={projectRequest.isRejected}
              rejectionStep={projectRequest.rejectionStep}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
