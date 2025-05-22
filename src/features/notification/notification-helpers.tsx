import {
  X,
  BellRing,
  FileText,
  PiggyBank,
  RefreshCw,
  DollarSign,
  FileSearch,
  ScrollText,
  ReceiptText,
  CheckCircle2,
  ArrowDownToLine,
  ClipboardCheck,
} from "lucide-react"
import type { NotificationAction } from "@/features/notification/notification-types"

export const getActionIcon = (action: NotificationAction) => {
  const iconMap = {
    created: <FileText className="h-5 w-5" />,
    updated: <RefreshCw className="h-5 w-5" />,
    submitted: <FileText className="h-5 w-5" />,
    reviewed: <FileSearch className="h-5 w-5" />,
    approved: <CheckCircle2 className="h-5 w-5" />,
    rejected: <X className="h-5 w-5" />,
    checked: <PiggyBank className="h-5 w-5" />,
    disbursed: <DollarSign className="h-5 w-5" />,
    received: <ArrowDownToLine className="h-5 w-5" />,
    receipted: <ReceiptText className="h-5 w-5" />,
    validated: <ClipboardCheck className="h-5 w-5" />,
    resolution_created: <ScrollText className="h-5 w-5" />,
  }

  return iconMap[action] || <BellRing className="h-5 w-5" />
}

export const getActionColor = (action: NotificationAction) => {
  const colorMap = {
    created: "bg-blue-50 text-blue-700 border-blue-200",
    updated: "bg-blue-50 text-blue-700 border-blue-200",
    submitted: "bg-blue-50 text-blue-700 border-blue-200",
    reviewed: "bg-purple-50 text-purple-700 border-purple-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    checked: "bg-amber-50 text-amber-700 border-amber-200",
    disbursed: "bg-indigo-50 text-indigo-700 border-indigo-200",
    received: "bg-sky-50 text-sky-700 border-sky-200",
    receipted: "bg-teal-50 text-teal-700 border-teal-200",
    validated: "bg-green-50 text-green-700 border-green-200",
    resolution_created: "bg-violet-50 text-violet-700 border-violet-200",
  }

  return colorMap[action] || "bg-slate-50 text-slate-700 border-slate-200"
}

export const getActionLabel = (action: NotificationAction) => {
  const labelMap = {
    created: "Created",
    updated: "Updated",
    submitted: "Submitted",
    reviewed: "Reviewed",
    approved: "Approved",
    rejected: "Rejected",
    checked: "Checked",
    disbursed: "Disbursed",
    received: "Received",
    receipted: "Receipted",
    validated: "Validated",
    resolution_created: "Resolution Created",
  }

  return labelMap[action] || action
}
