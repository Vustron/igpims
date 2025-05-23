"use client"

import { TimelineStatusBadge } from "@/features/fund-request/timeline-status"
import { timelineSteps } from "@/features/fund-request/timeline-sample-data"
import { Card, CardContent, CardHeader } from "@/components/ui/cards"
import { ChevronDown, ChevronUp, XCircle } from "lucide-react"
import { Timeline } from "@/features/fund-request/timeline"
import { Button } from "@/components/ui/buttons"

import { useState } from "react"

import type { FundRequest } from "@/features/fund-request/timeline-sample-data"

export const FundRequestCard = ({
  fundRequest,
}: { fundRequest: FundRequest }) => {
  const [isExpanded, setIsExpanded] = useState(false)

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

  return (
    <Card className="mb-4 w-full overflow-hidden border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <CardHeader className="p-3 sm:p-4 sm:pb-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {/* ID */}
          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Request ID</p>
            <p className="truncate font-medium text-sm">{fundRequest.id}</p>
          </div>

          {/* Purpose */}
          <div className="col-span-1 space-y-0.5">
            <p className="text-slate-500 text-xs">Purpose</p>
            <p className="truncate font-medium text-sm">
              {fundRequest.purpose}
            </p>
          </div>

          {/* Amount */}
          <div className="col-span-2 space-y-0.5 sm:col-span-1">
            <p className="text-slate-500 text-xs">Amount</p>
            <p className="truncate font-medium text-emerald-700 text-sm">
              {formatCurrency(fundRequest.amount)}
            </p>
          </div>

          {/* Utilized Funds */}
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

          {/* Allocated Funds */}
          <div className="col-span-2 space-y-0.5 sm:col-span-1 md:col-span-1">
            <p className="text-slate-500 text-xs">Allocated</p>
            <p className="truncate font-medium text-sm">
              {formatCurrency(fundRequest.allocatedFunds)}
            </p>
          </div>

          {/* Status */}
          <div className="col-span-2 space-y-0.5 sm:col-span-3 md:col-span-1">
            <p className="text-slate-500 text-xs">Status</p>
            <div className="flex items-center gap-2">
              <TimelineStatusBadge status={fundRequest.status} />
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
        {fundRequest.isRejected && fundRequest.rejectionReason && (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-red-50 p-2 text-red-700">
            <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
            <div>
              <p className="font-medium text-sm">Rejected</p>
              <p className="text-xs">{fundRequest.rejectionReason}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-3 sm:p-4 sm:pt-2">
        {/* Timeline for desktop */}
        <div className="mb-3 hidden rounded-md bg-slate-50 p-4 sm:block">
          <Timeline
            currentStep={fundRequest.currentStep}
            steps={timelineSteps}
            isRejected={fundRequest.isRejected}
            rejectionStep={fundRequest.rejectionStep}
          />
        </div>

        {/* Timeline for mobile */}
        <div className="mb-3 rounded-md bg-slate-50 p-3 sm:hidden">
          <div className="flex flex-col">
            <Timeline
              currentStep={fundRequest.currentStep}
              isMobile={true}
              steps={timelineSteps}
              isRejected={fundRequest.isRejected}
              rejectionStep={fundRequest.rejectionStep}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
