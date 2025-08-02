"use client"

import { useDeleteIgp } from "@/backend/actions/igp/delete-igp"
import { IgpWithProjectLeadData } from "@/backend/actions/igp/find-many"
import { Button } from "@/components/ui/buttons"
import { Card, CardContent, CardHeader } from "@/components/ui/cards"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useCheckRoleStore } from "@/hooks/use-check-role"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { UserRole } from "@/types/user"
import { catchError } from "@/utils/catch-error"
import { formatDateFromTimestamp } from "@/utils/date-convert"
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
import toast from "react-hot-toast"
import { ProjectTimeline } from "./project-timeline"
import { timelineSteps } from "./project-timeline-sample-data"
import { TimelineStatusBadge } from "./project-timeline-status"

export const ProjectRequestCard = ({
  projectRequest,
}: {
  projectRequest: IgpWithProjectLeadData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const confirm = useConfirm()
  const deleteFundRequest = useDeleteIgp(projectRequest.id)
  const { onOpen } = useDialog()
  const userRole = useCheckRoleStore((state) => state.userRole) as UserRole

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Delete project proposal",
      "Are you sure you want to delete this project proposal? This action cannot be undone.",
    )

    if (confirmed) {
      await toast.promise(deleteFundRequest.mutateAsync(), {
        loading: (
          <span className="animate-pulse">Deleting project proposal...</span>
        ),
        success: "Project proposal deleted successfully",
        error: (error) => catchError(error),
      })
    }
  }

  const getStatusAction = () => {
    switch (projectRequest.status) {
      case "pending":
        return {
          label: "Start Review",
          action: () => onOpen("reviewProjectRequest", { igp: projectRequest }),
          color: "bg-blue-600 hover:bg-blue-700",
          disabled:
            userRole === "chief_legislator" ||
            userRole === "legislative_secretary",
        }
      case "in_review":
        return {
          label: "Upload Resolution",
          action: () => onOpen("createResolution", { igp: projectRequest }),
          color: "bg-purple-600 hover:bg-purple-700",
          disabled:
            userRole === "chief_legislator" ||
            userRole === "legislative_secretary",
        }
      case "checking":
        return {
          label: "Check submmitted documents",
          action: () =>
            onOpen("approveProjectRequest", { igp: projectRequest }),
          color: "bg-emerald-600 hover:bg-emerald-700",
          disabled: false,
        }
      case "approved":
        return {
          label: "Final administrative review",
          action: () => onOpen("startImplementation", { igp: projectRequest }),
          color: "bg-indigo-600 hover:bg-indigo-700",
          disabled: false,
        }
      case "in_progress":
        return {
          label: "Mark Completed",
          action: () => onOpen("completeProject", { igp: projectRequest }),
          color: "bg-green-600 hover:bg-green-700",
          disabled:
            userRole === "chief_legislator" ||
            userRole === "legislative_secretary",
        }
      default:
        return null
    }
  }

  const statusAction = getStatusAction()

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
              {projectRequest.projectLeadData?.name}
            </p>
          </div>

          {/* Project Title */}
          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Project Title</p>
            <p className="truncate font-medium text-sm">
              {projectRequest.igpName}
            </p>
          </div>

          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Date Submitted</p>
            <p className="flex items-center gap-1 truncate font-medium text-sm">
              <Calendar className="size-3.5 text-slate-400" />
              {formatDateFromTimestamp(projectRequest.requestDate)}
            </p>
          </div>

          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Status</p>
            <div className="flex items-center gap-2">
              <TimelineStatusBadge status={projectRequest.status} />

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

              {(userRole === "admin" || userRole === "ssc_president") && (
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
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Proposal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

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

        {statusAction &&
          userRole !== "dpdm_secretary" &&
          userRole !== "dpdm_officers" &&
          userRole !== "ssc_treasurer" &&
          projectRequest.status !== "completed" &&
          projectRequest.status !== "rejected" && (
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                className={`gap-2 ${statusAction.color}`}
                onClick={statusAction.action}
                disabled={statusAction.disabled}
              >
                <Play className="h-3 w-3" />
                {statusAction.label}
              </Button>
            </div>
          )}

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
        <div className="mb-3 hidden rounded-md bg-slate-50 p-4 sm:block">
          <ProjectTimeline
            currentStep={projectRequest.currentStep ?? 1}
            steps={timelineSteps}
            isRejected={projectRequest.isRejected ?? undefined}
            rejectionStep={projectRequest.rejectionStep ?? undefined}
            isCompleted={projectRequest.status === "completed"}
          />
        </div>

        <div className="mb-3 rounded-md bg-slate-50 p-3 sm:hidden">
          <div className="flex flex-col">
            <ProjectTimeline
              currentStep={projectRequest.currentStep ?? 1}
              isMobile={true}
              steps={timelineSteps}
              isRejected={projectRequest.isRejected ?? undefined}
              rejectionStep={projectRequest.rejectionStep ?? undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
