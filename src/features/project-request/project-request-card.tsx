"use client"

import { format } from "date-fns"
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Play,
  Trash2,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/buttons"
import { Card, CardContent, CardHeader } from "@/components/ui/cards"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useDialog } from "@/hooks/use-dialog"
import { ProjectRequest } from "./project-request-store"
import { ProjectTimeline } from "./project-timeline"
import { timelineSteps } from "./project-timeline-sample-data"
import { TimelineStatusBadge } from "./project-timeline-status"

export const ProjectRequestCard = ({
  projectRequest,
}: {
  projectRequest: ProjectRequest
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { onOpen } = useDialog()

  const getStatusAction = () => {
    switch (projectRequest.status) {
      case "pending":
        return {
          label: "Start Review",
          action: () =>
            onOpen("reviewProjectRequest", { requestId: projectRequest.id }),
          color: "bg-blue-600 hover:bg-blue-700",
        }
      case "in_review":
        return {
          label: "Create Resolution",
          action: () =>
            onOpen("createResolution", { requestId: projectRequest.id }),
          color: "bg-purple-600 hover:bg-purple-700",
        }
      case "checking":
        return {
          label: "Approve Project",
          action: () =>
            onOpen("approveProjectRequest", { requestId: projectRequest.id }),
          color: "bg-emerald-600 hover:bg-emerald-700",
        }
      case "approved":
        return {
          label: "Start Implementation",
          action: () =>
            onOpen("startImplementation", { requestId: projectRequest.id }),
          color: "bg-indigo-600 hover:bg-indigo-700",
        }
      case "in_progress":
        return {
          label: "Mark Completed",
          action: () =>
            onOpen("completeProject", { requestId: projectRequest.id }),
          color: "bg-green-600 hover:bg-green-700",
        }
      default:
        return null
    }
  }

  const statusAction = getStatusAction()

  // Determine if deletion is allowed
  // const canDelete =
  //   projectRequest.status === "pending" || projectRequest.status === "rejected"

  // Determine card styling based on status
  const getCardStyling = () => {
    if (projectRequest.status === "completed") {
      return {
        cardClass:
          "mb-4 w-full overflow-hidden border border-green-300 bg-green-50 shadow-sm transition-all hover:border-green-400 hover:shadow-md",
        headerClass: "p-3 sm:p-4 sm:pb-2 bg-green-100/50",
        contentClass: "p-3 sm:p-4 sm:pt-2 bg-green-50/30",
      }
    }

    if (projectRequest.isRejected) {
      return {
        cardClass:
          "mb-4 w-full overflow-hidden border border-red-200 bg-red-50 shadow-sm transition-all hover:border-red-300 hover:shadow-md",
        headerClass: "p-3 sm:p-4 sm:pb-2",
        contentClass: "p-3 sm:p-4 sm:pt-2",
      }
    }

    return {
      cardClass:
        "mb-4 w-full overflow-hidden border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md",
      headerClass: "p-3 sm:p-4 sm:pb-2",
      contentClass: "p-3 sm:p-4 sm:pt-2",
    }
  }

  const { cardClass, headerClass, contentClass } = getCardStyling()

  return (
    <Card className={cardClass}>
      <CardHeader className={headerClass}>
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
              {projectRequest.projectLead}
            </p>
          </div>

          {/* Project Title */}
          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Project Title</p>
            <p className="truncate font-medium text-sm">
              {projectRequest.projectTitle}
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

          {/* Status & Actions */}
          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Status</p>
            <div className="flex items-center gap-2">
              <TimelineStatusBadge status={projectRequest.status} />

              {/* Mobile expand button */}
              <Button
                variant="ghost"
                size="icon"
                className="size-6 sm:hidden"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </Button>

              {/* Actions dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto size-6"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      onOpen("deleteProjectRequest", {
                        requestId: projectRequest.id,
                      })
                    }
                    // disabled={!canDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Proposal
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Completed Badge */}
        {projectRequest.status === "completed" && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-green-100 p-2 text-green-700">
            <CheckCircle className="size-4 text-green-600" />
            <div>
              <p className="font-medium text-sm">Project Completed</p>
              <p className="text-xs">
                IGP project has been successfully implemented
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {statusAction &&
          projectRequest.status !== "completed" &&
          projectRequest.status !== "rejected" && (
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                className={`gap-2 ${statusAction.color}`}
                onClick={statusAction.action}
              >
                <Play className="h-3 w-3" />
                {statusAction.label}
              </Button>
            </div>
          )}

        {/* Rejection reason (if rejected) */}
        {projectRequest.isRejected && projectRequest.rejectionReason && (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-red-100 p-2 text-red-700">
            <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
            <div>
              <p className="font-medium text-sm">Rejected</p>
              <p className="text-xs">{projectRequest.rejectionReason}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className={contentClass}>
        {/* Timeline for desktop */}
        <div className="mb-3 hidden rounded-md bg-slate-50 p-4 sm:block">
          <ProjectTimeline
            currentStep={projectRequest.currentStep}
            steps={timelineSteps}
            isRejected={projectRequest.isRejected}
            rejectionStep={projectRequest.rejectionStep}
          />
        </div>

        {/* Timeline for mobile */}
        <div className="mb-3 rounded-md bg-slate-50 p-3 sm:hidden">
          <div className="flex flex-col">
            <ProjectTimeline
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
