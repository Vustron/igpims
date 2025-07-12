import z from "zod"

const statusEnum = z.enum([
  "pending",
  "in_review",
  "checking",
  "approved",
  "disbursed",
  "received",
  "receipted",
  "validated",
  "rejected",
])

export const createFundRequestSchema = z.object({
  requestor: z.string().min(1, "Requestor is required"),
  purpose: z.string().min(1, "Purpose is required"),
  position: z.string().min(1, "Position is required"),
  amount: z.any().optional(),
  requestDate: z.any().optional(),
  dateNeeded: z.any().optional(),
})

export const updateFundRequestSchema = z.object({
  id: z.string().optional(),
  purpose: z.string().min(1, "Purpose is required").optional(),
  amount: z.number().min(0, "Amount must be positive").optional(),
  utilizedFunds: z
    .number()
    .min(0, "Utilized funds must be positive")
    .optional(),
  allocatedFunds: z
    .number()
    .min(0, "Allocated funds must be positive")
    .optional(),
  status: statusEnum.optional(),
  currentStep: z
    .number()
    .int()
    .min(1, "Current step must be at least 1")
    .optional(),
  requestDate: z.any().optional(),
  dateNeeded: z.any().optional(),
  requestor: z.string().min(1, "Requestor is required").optional(),
  requestorPosition: z.string().min(1, "Position is required").optional(),
  isRejected: z.any().optional(),
  rejectionStep: z.any().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
  reviewerComments: z.string().optional(),
  disbursementDate: z.any().optional(),
  receiptDate: z.any().optional(),
  validationDate: z.any().optional(),
  receipts: z.any().optional(),
  approvedBy: z.string().optional(),
})

export type CreateFundRequest = z.infer<typeof createFundRequestSchema>
export type UpdateFundRequest = z.infer<typeof updateFundRequestSchema>
