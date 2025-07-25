import z from "zod"

export const createIgpSchema = z.object({
  id: z.string().optional(),
  igpName: z.string().min(1, "IGP name is required").optional(),
  igpDescription: z.string().min(1, "IGP description is required").optional(),
  iconType: z.string().min(1, "IGP icon is required").optional(),
  semesterAndAcademicYear: z
    .string()
    .min(1, "Semester and academic year are required")
    .optional(),
  igpType: z.string().min(1, "Type of IGP is required").optional(),
  igpStartDate: z.any().optional(),
  igpEndDate: z.any().optional(),
  itemsToSell: z.string().min(1, "Item to sell is required").optional(),
  assignedOfficers: z
    .array(z.string())
    .min(1, "At least one officer is required")
    .optional(),
  costPerItem: z.string().min(1, "Cost per item is required").optional(),
  projectLead: z.string().min(1, "Project lead is required").optional(),
  position: z.string().optional(),
  projectTitle: z.string().optional(),
  purpose: z.string().optional(),
  requestDate: z.any().optional(),
  igpDateNeeded: z.any().optional(),
})

export const updateIgpSchema = z.object({
  id: z.string().optional(),
  igpName: z.string().optional(),
  igpDescription: z.string().optional(),
  iconType: z.string().optional(),
  semesterAndAcademicYear: z.string().optional(),
  igpType: z.string().optional(),
  totalSold: z.number().optional(),
  igpRevenue: z.number().optional(),
  igpStartDate: z.any().optional(),
  igpEndDate: z.any().optional(),
  itemsToSell: z.string().optional(),
  assignedOfficers: z.any().optional(),
  costPerItem: z.number().optional(),
  projectLead: z.string().optional(),
  position: z.string().optional(),
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
  igpDateNeeded: z.any().optional(),
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
