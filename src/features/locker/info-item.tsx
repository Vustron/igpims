import { Label } from "@/components/ui/labels"
import { cn } from "@/utils/cn"

interface InfoItemProps {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export const InfoItem = ({ label, value, icon, className }: InfoItemProps) => (
  <div className={cn("space-y-1", className)}>
    <Label className="flex items-center gap-1 font-medium text-slate-600 text-xs dark:text-slate-400">
      {icon}
      {label}
    </Label>
    <div className="font-medium text-slate-900 text-sm dark:text-slate-100">
      {value}
    </div>
  </div>
)
