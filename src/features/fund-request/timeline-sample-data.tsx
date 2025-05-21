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

export interface FundRequest {
  id: string
  purpose: string
  amount: number
  utilizedFunds: number
  allocatedFunds: number
  status:
    | "pending"
    | "in_review"
    | "checking"
    | "approved"
    | "disbursed"
    | "received"
    | "receipted"
    | "validated"
    | "rejected"
  currentStep: number
  requestDate: Date
  lastUpdated: Date
  requestor: string
  department: string
  isRejected?: boolean
  rejectionStep?: number
  rejectionReason?: string
}

export interface TimelineStepType {
  id: number
  name: string
  shortName: string
  icon: React.ReactNode
  description: string
  rejectionReason?: string
}

// Sample data
export const sampleFundRequests: FundRequest[] = [
  {
    id: "FR-2023-001",
    purpose: "Annual Department Event",
    amount: 15000,
    utilizedFunds: 12500,
    allocatedFunds: 15000,
    status: "rejected",
    currentStep: 8,
    requestDate: new Date(2023, 5, 15),
    lastUpdated: new Date(2023, 6, 20),
    requestor: "John Smith",
    department: "Student Affairs",
    isRejected: true,
    rejectionStep: 8,
    rejectionReason: "Insufficient supporting documentation for expenses",
  },
  {
    id: "FR-2023-002",
    purpose: "Equipment",
    amount: 25000,
    utilizedFunds: 0,
    allocatedFunds: 25000,
    status: "approved",
    currentStep: 4,
    requestDate: new Date(2023, 6, 5),
    lastUpdated: new Date(2023, 6, 15),
    requestor: "Maria Garcia",
    department: "Computer Laboratory",
  },
  {
    id: "FR-2023-003",
    purpose: "Training",
    amount: 8500,
    utilizedFunds: 8500,
    allocatedFunds: 8500,
    status: "receipted",
    currentStep: 7,
    requestDate: new Date(2023, 7, 12),
    lastUpdated: new Date(2023, 7, 30),
    requestor: "David Chen",
    department: "Faculty Development",
  },
]

// Timeline steps definition
export const timelineSteps = [
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
    rejectionReason: "Insufficient documentation",
  },
]
