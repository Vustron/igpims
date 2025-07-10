import z from "zod"

export const createFundRequestSchema = z.object({
  requestorName: z.string().min(1, "Requestor name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  position: z.string().min(1, "Position is required"),
  amount: z.any().optional(),
  requestDate: z.any().optional(),
  dateNeeded: z.any().optional(),
})

export const updateFundRequestSchema = z.object({
  id: z.string().optional(),
  requestorName: z.string().min(1, "Requestor name is required").optional(),
  purpose: z.string().min(1, "Purpose is required").optional(),
  position: z.string().min(1, "Position is required").optional(),
  amount: z.any().optional(),
  requestDate: z.any().optional(),
  dateNeeded: z.any().optional(),
  utilizedFunds: z.any().optional(),
  allocatedFunds: z.any().optional(),
  status: z.string().optional(),
  requestorPosition: z.string().optional(),
  approvedBy: z.string().optional(),
})

export type CreateFundRequest = z.infer<typeof createFundRequestSchema>
export type UpdateFundRequest = z.infer<typeof updateFundRequestSchema>
