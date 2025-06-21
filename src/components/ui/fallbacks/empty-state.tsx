"use client"

import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { cn } from "@/utils/cn"

interface EmptyStateProps {
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: any
  }
  className?: string
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-muted-foreground/20 border-dashed bg-muted/10 p-8 text-center",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="rounded-full bg-muted p-3">
          <Icon className="size-8 text-muted-foreground/50" />
        </div>
        <h3 className="mt-4 font-semibold text-foreground text-lg">{title}</h3>
        <p className="mt-2 mb-4 max-w-sm text-muted-foreground text-sm">
          {description}
        </p>
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "default"}
            size="sm"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
