import {
  Files,
  FileText,
  FileSearch,
  ScrollText,
  CheckCircle2,
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

// Sample data for development
export const sampleProjectRequests = [
  {
    id: "IGP-2023-001",
    projectTitle: "Student Entrepreneurship Program",
    purpose: "Annual Department Event",
    projectLead: "John Smith",
    department: "Student Affairs",
    status: "rejected" as const,
    currentStep: 5,
    requestDate: new Date(2023, 5, 15),
    lastUpdated: new Date(2023, 6, 20),
    isRejected: true,
    rejectionStep: 5,
    rejectionReason: "Insufficient market analysis and financial projections",
  },
  {
    id: "IGP-2023-002",
    projectTitle: "Campus Eco-Store",
    purpose: "Equipment and Supplies",
    projectLead: "Maria Garcia",
    department: "Environmental Science",
    status: "approved" as const,
    currentStep: 4,
    requestDate: new Date(2023, 6, 5),
    lastUpdated: new Date(2023, 6, 15),
  },
  {
    id: "IGP-2023-003",
    projectTitle: "Culinary Arts Products",
    purpose: "Training and Materials",
    projectLead: "David Chen",
    department: "Hospitality Management",
    status: "in_progress" as const,
    currentStep: 5,
    requestDate: new Date(2023, 7, 12),
    lastUpdated: new Date(2023, 7, 30),
  },
]
