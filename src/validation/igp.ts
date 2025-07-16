import z from "zod"

export const createIgpSchema = z.object({
  id: z.string().optional(),
  igpName: z.string().min(1, "IGP name is required"),
  igpDescription: z.string().min(1, "IGP description is required"),
  iconType: z.string().min(1, "IGP icon is required"),
  semesterAndAcademicYear: z
    .string()
    .min(1, "Semester and academic year are required"),
  igpType: z.string().min(1, "Type of IGP is required"),
  igpStartDate: z.any(),
  igpEndDate: z.any(),
  itemsToSell: z.string().min(1, "Item to sell is required"),
  assignedOfficers: z
    .array(z.string())
    .min(1, "At least one officer is required"),
  estimatedQuantities: z.string().min(1, "Estimated quantities are required"),
  budget: z.string().min(1, "Budget is required"),
  costPerItem: z.string().min(1, "Cost per item is required"),
  projectLead: z.string().min(1, "Project lead is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().optional(),
  typeOfTransaction: z.string().optional(),
  projectTitle: z.string().optional(),
  purpose: z.string().optional(),
  requestDate: z.any().optional(),
  dateNeeded: z.any().optional(),
})

export const updateIgpSchema = z.object({
  id: z.string().optional(),
  igpName: z.string().min(1, "IGP name is required.").optional(),
  igpDescription: z.string().min(1, "IGP description is required.").optional(),
  iconType: z.string().min(1, "IGP icon is required.").optional(),
  semesterAndAcademicYear: z
    .string()
    .min(1, "Semester and academic year are required.")
    .optional(),
  igpType: z.string().min(1, "Type of IGP is required.").optional(),
  totalSold: z.number().optional(),
  igpRevenue: z.number().optional(),
  igpStartDate: z.any().optional(),
  igpEndDate: z.any().optional(),
  itemsToSell: z.string().min(1, "Item to sell is required.").optional(),
  assignedOfficers: z.any().optional(),
  estimatedQuantities: z
    .number()
    .min(1, "Estimated quantities are required.")
    .optional(),
  budget: z.number().min(1, "Budget is required.").optional(),
  costPerItem: z.number().min(1, "Cost per item is required.").optional(),
  projectLead: z.string().min(1, "Project lead is required.").optional(),
  department: z.string().min(1, "Department is required.").optional(),
  position: z.string().optional(),
  typeOfTransaction: z.string().optional(),
  status: z
    .enum([
      "pending",
      "in_review",
      "checking",
      "approved",
      "in_progress",
      "completed",
      "rejected",
    ])
    .optional(),
  currentStep: z.number().optional(),
  requestDate: z.number().optional(),
  dateNeeded: z.number().optional(),
  isRejected: z.boolean().optional(),
  rejectionStep: z.number().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
  reviewerComments: z.string().optional(),
  projectDocument: z.string().optional(),
  resolutionDocument: z.string().optional(),
  submissionDate: z.any().optional(),
  approvalDate: z.any().optional(),
})

export type CreateIgpPayload = z.infer<typeof createIgpSchema>
export type UpdateIgpPayload = z.infer<typeof updateIgpSchema>
