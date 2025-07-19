"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import { Check, MessageCircleWarning, X } from "lucide-react"
import { ReactElement } from "react"
import React from "react"
import { TimelineStepType } from "./fund-request-interface"

interface TimelineStepProps {
  step: TimelineStepType
  isFinished: boolean
  isCurrent: boolean
  isRejected?: boolean
  isMobile?: boolean
  isCompleted?: boolean
  onStepClick?: (stepId: number) => void
}

export const FundRequestTimelineStep = ({
  step,
  isFinished,
  isCurrent,
  isRejected,
  isMobile = false,
  isCompleted,
  onStepClick,
}: TimelineStepProps) => {
  const showTooltip =
    !isCurrent && (step.description || (isRejected && step.rejectionReason))

  const isClickable = isFinished && onStepClick

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "group relative z-10 flex",
              isMobile
                ? "w-full items-start gap-3 py-2 pl-12"
                : "flex-col items-center rounded-xl bg-background p-1 sm:p-2",
              isClickable && "cursor-pointer",
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: isClickable ? 1.05 : 1 }}
            onClick={() => isClickable && onStepClick(step.id)}
          >
            <motion.div
              className={cn(
                "z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 sm:size-8",
                isCompleted
                  ? "border-green-500 bg-green-500 text-white"
                  : isRejected
                    ? "border-red-500 bg-red-500 text-white"
                    : isCurrent
                      ? "border-blue-500 bg-blue-500 text-white"
                      : isFinished
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-slate-200 bg-white text-slate-400",
                "transition-transform duration-200 group-hover:scale-110",
              )}
              whileHover={{ scale: 1.05 }}
              animate={
                isCompleted
                  ? { boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.3)" }
                  : isCurrent && !isRejected
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.3)",
                      }
                    : isRejected
                      ? { boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.3)" }
                      : isFinished
                        ? { boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.3)" }
                        : {}
              }
              transition={{
                repeat:
                  isCurrent && !isRejected && !isCompleted
                    ? Number.POSITIVE_INFINITY
                    : 0,
                duration: 2,
              }}
            >
              {isCurrent && !isRejected ? (
                <MessageCircleWarning className="size-3 sm:size-4" />
              ) : (isCompleted && !isRejected) ||
                (isFinished && !isRejected) ? (
                <Check className="size-3 sm:size-4" />
              ) : isRejected ? (
                <X className="size-3 sm:size-4" />
              ) : React.isValidElement(step.icon) ? (
                React.cloneElement(
                  step.icon as ReactElement<{ className?: string }>,
                  { className: "size-3 sm:size-4" },
                )
              ) : null}
            </motion.div>

            <div
              className={cn(
                isMobile ? "mt-0" : "mt-1 text-center",
                isCompleted
                  ? "text-green-700"
                  : isRejected
                    ? "text-red-700"
                    : isCurrent
                      ? "font-medium text-blue-700"
                      : isFinished
                        ? "text-green-700"
                        : "text-slate-500",
              )}
            >
              <p className={cn("whitespace-nowrap font-medium")}>
                {isMobile ? step.name : step.shortName}
              </p>
              {(isCurrent || isRejected || isCompleted) && (
                <p
                  className={cn(
                    "text-[9px] line-clamp-2 h-8",
                    isRejected ? "text-red-500" : "text-slate-500",
                    isMobile ? "mt-1" : "mx-auto mt-0.5 w-24",
                  )}
                >
                  {isRejected && step.rejectionReason
                    ? step.rejectionReason
                    : step.description}
                </p>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>

        {showTooltip && (
          <TooltipContent
            side={isMobile ? "right" : "bottom"}
            align={isMobile ? "start" : "center"}
            className={cn(
              "max-w-xs",
              isCompleted
                ? "bg-green-800 text-white"
                : isRejected
                  ? "bg-red-800 text-white"
                  : "bg-slate-800 text-white",
            )}
          >
            {isRejected && step.rejectionReason ? (
              <div className="flex flex-col gap-1">
                <span className="font-medium">Rejected:</span>
                <span>{step.rejectionReason}</span>
              </div>
            ) : (
              <span>{step.description}</span>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
