"use client"

import { useDeleteFundRequest } from "@/backend/actions/fund-request/delete-fund-request"
import { FundRequestWithUser } from "@/backend/actions/fund-request/find-by-id"
import { Button } from "@/components/ui/buttons"
import { Card, CardContent, CardHeader } from "@/components/ui/cards"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { catchError } from "@/utils/catch-error"
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Play,
  Trash2,
  XCircle,
} from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"
import toast from "react-hot-toast"
import { timelineSteps } from "./fund-request-interface"
import { Timeline } from "./timeline"
import { TimelineStatusBadge } from "./timeline-status"

interface FundRequestCardProps {
  fundRequest: FundRequestWithUser
  isSelected?: boolean
  onSelect?: () => void
}

export const FundRequestCard = ({
  fundRequest,
  // isSelected = false,
  // onSelect,
}: FundRequestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { onOpen } = useDialog()
  const confirm = useConfirm()
  const deleteFundRequest = useDeleteFundRequest(fundRequest.id)
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Delete fund request",
      "Are you sure you want to delete this fund request? This action cannot be undone.",
    )

    if (confirmed) {
      await toast.promise(deleteFundRequest.mutateAsync(), {
        loading: (
          <span className="animate-pulse">Deleting fund request...</span>
        ),
        success: "Fund request deleted successfully",
        error: (error) => catchError(error),
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const utilizationPercentage =
    Math.round(
      (fundRequest.utilizedFunds / fundRequest.allocatedFunds) * 100,
    ) || 0

  const getStatusAction = () => {
    switch (fundRequest.status) {
      case "pending":
        return {
          label: "Start Review",
          action: () =>
            onOpen("reviewFundRequest", { fundRequest: fundRequest }),
          color: "bg-blue-600 hover:bg-blue-700",
        }
      case "in_review":
        return {
          label: "Check Funds",
          action: () => onOpen("checkFunds", { fundRequest: fundRequest }),
          color: "bg-purple-600 hover:bg-purple-700",
        }
      case "checking":
        return {
          label: "Approve Release",
          action: () =>
            onOpen("approveFundRequest", { fundRequest: fundRequest }),
          color: "bg-emerald-600 hover:bg-emerald-700",
        }
      case "approved":
        return {
          label: "Disburse Funds",
          action: () => onOpen("disburseFunds", { fundRequest: fundRequest }),
          color: "bg-indigo-600 hover:bg-indigo-700",
        }
      case "disbursed":
        return {
          label: "Mark as Received",
          action: () => onOpen("receiveFunds", { fundRequest: fundRequest }),
          color: "bg-sky-600 hover:bg-sky-700",
        }
      case "received":
        return {
          label: "Submit Receipt",
          action: () => router.push(`/fund-request/${fundRequest.id}`),
          color: "bg-teal-600 hover:bg-teal-700",
        }
      case "receipted":
        return {
          label: "Validate Expense",
          action: () => router.push(`/fund-request/${fundRequest.id}`),
          color: "bg-green-600 hover:bg-green-700",
        }
      default:
        return null
    }
  }

  const statusAction = getStatusAction()

  const getCardStyling = () => {
    if (fundRequest.status === "validated") {
      return {
        cardClass:
          "mb-4 w-full overflow-hidden border border-green-300 bg-green-50 shadow-sm transition-all hover:border-green-400 hover:shadow-md",
        headerClass: "p-3 sm:p-4 sm:pb-2 bg-green-100/50",
        contentClass: "p-3 sm:p-4 sm:pt-2 bg-green-50/30",
      }
    }

    if (fundRequest.isRejected) {
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Request ID</p>
            <p className="truncate font-medium text-sm">{fundRequest.id}</p>
          </div>

          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Purpose</p>
            <p className="truncate font-medium text-sm">
              {fundRequest.purpose}
            </p>
          </div>

          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Amount</p>
            <p className="truncate font-medium text-emerald-700 text-sm">
              {formatCurrency(fundRequest.amount)}
            </p>
          </div>

          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Utilized</p>
            <div className="flex items-center gap-1">
              <p className="truncate font-medium text-sm">
                {formatCurrency(fundRequest.utilizedFunds)}
              </p>
              <span className="whitespace-nowrap text-slate-500 text-xs">
                ({utilizationPercentage}%)
              </span>
            </div>
          </div>

          <div className="col-span-2 space-y-0.5 sm:col-span-1 md:col-span-1">
            <p className="text-slate-500 text-xs">Allocated</p>
            <p className="truncate font-medium text-sm">
              {formatCurrency(fundRequest.allocatedFunds)}
            </p>
          </div>

          <div className="col-span-2 space-y-0.5 sm:col-span-3 md:col-span-1">
            <p className="text-slate-500 text-xs">Status</p>
            <div className="flex items-center gap-2">
              <TimelineStatusBadge status={fundRequest.status} />
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
                    Delete Request
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {fundRequest.status === "validated" && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-green-100 p-2 text-green-700">
            <CheckCircle className="size-4 text-green-600" />
            <div>
              <p className="font-medium text-sm">Fund Request Completed</p>
              <p className="text-xs">
                All expenses have been validated and approved
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {statusAction &&
          fundRequest.status !== "validated" &&
          fundRequest.status !== "rejected" && (
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

        {fundRequest.isRejected && fundRequest.rejectionReason && (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-red-100 p-2 text-red-700">
            <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
            <div>
              <p className="font-medium text-sm">Rejected</p>
              <p className="text-xs">{fundRequest.rejectionReason}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className={contentClass}>
        <div className="mb-3 hidden rounded-md bg-slate-50 p-4 sm:block">
          <Timeline
            currentStep={fundRequest.currentStep}
            steps={timelineSteps}
            isRejected={fundRequest.isRejected}
            rejectionStep={fundRequest.rejectionStep}
            isCompleted={fundRequest.status === "validated"}
          />
        </div>

        <div className="mb-3 rounded-md bg-slate-50 p-3 sm:hidden">
          <div className="flex flex-col">
            <Timeline
              currentStep={fundRequest.currentStep}
              isMobile={true}
              steps={timelineSteps}
              isRejected={fundRequest.isRejected}
              rejectionStep={fundRequest.rejectionStep}
              isCompleted={fundRequest.status === "validated"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
