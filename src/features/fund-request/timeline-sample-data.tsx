import {
  FileText,
  PiggyBank,
  FileSearch,
  DollarSign,
  ReceiptText,
  CheckCircle2,
  ArrowDownToLine,
  ClipboardCheck,
} from "lucide-react"

export interface TimelineStepType {
  id: number
  name: string
  shortName: string
  icon: React.ReactNode
  description: string
  rejectionReason?: string
}

// Timeline steps definition
export const timelineSteps: TimelineStepType[] = [
  {
    id: 1,
    name: "Request Fund",
    shortName: "Request",
    icon: <FileText className="size-4" />,
    description: "Fund request submitted",
  },
  {
    id: 2,
    name: "Review Request",
    shortName: "Review",
    icon: <FileSearch className="size-4" />,
    description: "Request under review",
  },
  {
    id: 3,
    name: "Check Funds",
    shortName: "Check",
    icon: <PiggyBank className="size-4" />,
    description: "Checking available funds",
  },
  {
    id: 4,
    name: "Approve Release",
    shortName: "Approve",
    icon: <CheckCircle2 className="size-4" />,
    description: "Fund release approved",
  },
  {
    id: 5,
    name: "Disburse Fund",
    shortName: "Disburse",
    icon: <DollarSign className="size-4" />,
    description: "Funds disbursed",
  },
  {
    id: 6,
    name: "Receive Fund",
    shortName: "Receive",
    icon: <ArrowDownToLine className="size-4" />,
    description: "Funds received",
  },
  {
    id: 7,
    name: "Provide Receipt",
    shortName: "Receipt",
    icon: <ReceiptText className="size-4" />,
    description: "Expense receipts provided",
  },
  {
    id: 8,
    name: "Validate Expense",
    shortName: "Validate",
    icon: <ClipboardCheck className="size-4" />,
    description: "Expenses validated",
  },
]
