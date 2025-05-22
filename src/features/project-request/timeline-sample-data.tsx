import {
  Files,
  FileText,
  FileSearch,
  ScrollText,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react"

export interface ProjectRequest {
  id: string
  projectTitle: string
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
export const sampleProjectRequests: ProjectRequest[] = [
  {
    id: "IGP-2023-001",
    projectTitle: "Student Entrepreneurship Program",
    purpose: "Annual Department Event",
    amount: 15000,
    utilizedFunds: 12500,
    allocatedFunds: 15000,
    status: "rejected",
    currentStep: 5,
    requestDate: new Date(2023, 5, 15),
    lastUpdated: new Date(2023, 6, 20),
    requestor: "John Smith",
    department: "Student Affairs",
    isRejected: true,
    rejectionStep: 5,
    rejectionReason: "Insufficient market analysis and financial projections",
  },
  {
    id: "IGP-2023-002",
    projectTitle: "Campus Eco-Store",
    purpose: "Equipment and Supplies",
    amount: 25000,
    utilizedFunds: 0,
    allocatedFunds: 25000,
    status: "approved",
    currentStep: 4,
    requestDate: new Date(2023, 6, 5),
    lastUpdated: new Date(2023, 6, 15),
    requestor: "Maria Garcia",
    department: "Environmental Science",
  },
  {
    id: "IGP-2023-003",
    projectTitle: "Culinary Arts Products",
    purpose: "Training and Materials",
    amount: 8500,
    utilizedFunds: 8500,
    allocatedFunds: 8500,
    status: "receipted",
    currentStep: 6,
    requestDate: new Date(2023, 7, 12),
    lastUpdated: new Date(2023, 7, 30),
    requestor: "David Chen",
    department: "Hospitality Management",
  },
]

// Timeline steps definition
export const timelineSteps = [
  {
    id: 1,
    name: "Submit IGP Proposal",
    shortName: "Submit",
    icon: <FileText className="size-4" />,
    description: "Initial IGP proposal submitted",
  },
  {
    id: 2,
    name: "Review IGP Proposal",
    shortName: "Review",
    icon: <FileSearch className="size-4" />,
    description: "Proposal under committee review",
  },
  {
    id: 3,
    name: "Create Resolution",
    shortName: "Resolution",
    icon: <ScrollText className="size-4" />,
    description: "Committee creates official resolution",
  },
  {
    id: 4,
    name: "Submit Project & Resolution",
    shortName: "Submit",
    icon: <Files className="size-4" />,
    description: "Complete project proposal and resolution submitted",
  },
  {
    id: 5,
    name: "Final Review",
    shortName: "Review",
    icon: <ClipboardCheck className="size-4" />,
    description: "Final administrative review",
  },
  {
    id: 6,
    name: "Approved Project Proposal",
    shortName: "Approved",
    icon: <CheckCircle2 className="size-4" />,
    description: "Project fully approved for implementation",
  },
]
