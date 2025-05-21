"use client"

import { Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import React from "react"

import type { TimelineStepType } from "@/features/fund-request/timeline-sample-data"
import type { ReactElement } from "react"

export const TimelineStep = ({
  step,
  isCompleted,
  isCurrent,
  isRejected,
  isMobile = false,
}: {
  step: TimelineStepType
  isCompleted: boolean
  isCurrent: boolean
  isRejected?: boolean
  isMobile?: boolean
}) => {
  return (
    <motion.div
      className={cn(
        "group relative z-10 flex",
        isMobile
          ? "w-full items-start gap-3 py-2 pl-12"
          : "flex-col items-center rounded-xl bg-background p-1 sm:p-2",
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Step circle */}
      <motion.div
        className={cn(
          "z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 sm:size-8",
          isRejected
            ? "border-red-500 bg-red-500 text-white"
            : isCompleted
              ? "border-emerald-500 bg-emerald-500 text-white"
              : isCurrent
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-slate-200 bg-white text-slate-400",
          "transition-transform duration-200 group-hover:scale-110",
        )}
        whileHover={{ scale: 1.05 }}
        animate={
          isCurrent && !isRejected
            ? {
                scale: [1, 1.1, 1],
                boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.3)",
              }
            : isRejected
              ? { boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.3)" }
              : {}
        }
        transition={{
          repeat: isCurrent && !isRejected ? Number.POSITIVE_INFINITY : 0,
          duration: 2,
        }}
      >
        {isRejected ? (
          <X className="size-3 sm:size-4" />
        ) : isCompleted ? (
          <Check className="size-3 sm:size-4" />
        ) : React.isValidElement(step.icon) ? (
          React.cloneElement(
            step.icon as ReactElement<{ className?: string }>,
            { className: "size-3 sm:size-4" },
          )
        ) : null}
      </motion.div>

      {/* Step label */}
      <div
        className={cn(
          isMobile ? "mt-0" : "mt-1 text-center",
          isRejected
            ? "text-red-700"
            : isCompleted
              ? "text-emerald-700"
              : isCurrent
                ? "font-medium text-blue-700"
                : "text-slate-500",
        )}
      >
        <p
          className={cn(
            "whitespace-nowrap font-medium",
            isMobile ? "text-sm" : "text-xs sm:text-sm",
          )}
        >
          {isMobile ? step.name : step.shortName}
        </p>
        {(isCurrent || isRejected) && (
          <p
            className={cn(
              isRejected ? "text-red-500" : "text-slate-500",
              isMobile
                ? "mt-1 text-xs sm:text-sm"
                : "mx-auto mt-0.5 max-w-20 text-[10px] sm:text-xs",
            )}
          >
            {isRejected && step.rejectionReason
              ? step.rejectionReason
              : step.description}
          </p>
        )}
      </div>

      {/* Tooltip for description on hover */}
      {!isMobile && !isCurrent && !isRejected && step.description && (
        <div className="-bottom-2 -translate-x-1/2 absolute left-1/2 z-50 w-40 transform rounded bg-slate-800 px-2 py-1 text-center text-white text-xs opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          {step.description}
          <div className="-top-1 -translate-x-1/2 absolute left-1/2 h-2 w-2 rotate-45 transform bg-slate-800" />
        </div>
      )}

      {/* Rejection reason tooltip */}
      {!isMobile && !isCurrent && isRejected && step.rejectionReason && (
        <div className="-bottom-2 -translate-x-1/2 absolute left-1/2 z-50 w-48 transform rounded bg-red-800 px-2 py-1 text-center text-white text-xs opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          <span className="font-medium">Rejected: </span>
          {step.rejectionReason}
          <div className="-top-1 -translate-x-1/2 absolute left-1/2 h-2 w-2 rotate-45 transform bg-red-800" />
        </div>
      )}

      {/* Mobile tooltip */}
      {isMobile && !isCurrent && !isRejected && step.description && (
        <div className="absolute top-full left-12 z-50 mt-1 w-48 rounded bg-slate-800 px-2 py-1 text-white text-xs opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          {step.description}
          <div className="-top-1 absolute left-4 h-2 w-2 rotate-45 transform bg-slate-800" />
        </div>
      )}

      {/* Mobile rejection tooltip */}
      {isMobile && !isCurrent && isRejected && step.rejectionReason && (
        <div className="absolute top-full left-12 z-50 mt-1 w-48 rounded bg-red-800 px-2 py-1 text-white text-xs opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          <span className="font-medium">Rejected: </span>
          {step.rejectionReason}
          <div className="-top-1 absolute left-4 h-2 w-2 rotate-45 transform bg-red-800" />
        </div>
      )}
    </motion.div>
  )
}
