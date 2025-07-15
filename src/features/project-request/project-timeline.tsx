"use client"

import { cn } from "@/utils/cn"
import { TimelineStepType } from "./project-timeline-sample-data"
import { TimelineStep } from "./project-timeline-step"

export const ProjectTimeline = ({
  currentStep,
  steps,
  isMobile = false,
  isRejected,
  rejectionStep,
}: {
  currentStep: number
  steps: TimelineStepType[]
  isMobile?: boolean
  isRejected?: boolean
  rejectionStep?: number
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between",
        isMobile ? "flex-col items-start gap-0" : "gap-1 sm:gap-2",
      )}
    >
      <div
        className={cn(
          "absolute h-0.5 bg-slate-200",
          isMobile
            ? "top-0 left-4 h-full w-0.5"
            : "-translate-y-1/2 top-1/2 right-0 left-0",
        )}
      />

      <div
        className={cn(
          "absolute h-0.5 transition-all duration-500",
          isRejected ? "bg-red-500" : "bg-emerald-500",
          isMobile ? "top-0 left-4 w-0.5" : "-translate-y-1/2 top-1/2 left-0",
        )}
        style={
          isMobile
            ? {
                height: `${(Math.min(currentStep - 1, steps.length - 1) / (steps.length - 1)) * 100}%`,
              }
            : {
                width: `${(Math.min(currentStep - 1, steps.length - 1) / (steps.length - 1)) * 100}%`,
              }
        }
      />

      {steps.map((step) => (
        <TimelineStep
          key={step.id}
          step={step}
          isCompleted={step.id <= currentStep}
          isCurrent={false}
          isMobile={isMobile}
          isRejected={isRejected && step.id === rejectionStep}
        />
      ))}
    </div>
  )
}
