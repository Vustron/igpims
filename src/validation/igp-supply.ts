import { z } from "zod"

export const createIgpSupplySchema = z.object({
  id: z.string().optional(),
  igpId: z.string().min(1, "IGP ID is required").optional(),
  supplyDate: z.any().optional(),
  quantity: z.any().optional(),
  quantitySold: z.any().optional(),
  unitPrice: z.any().optional(),
  expenses: z.any().optional(),
  totalRevenue: z.any().optional(),
})

export const updateIgpSupplySchema = z.object({
  id: z.string().optional(),
  igpId: z.string().min(1, "IGP ID is required").optional(),
  supplyDate: z.any().optional(),
  quantity: z.any().optional(),
  quantitySold: z.any().optional(),
  unitPrice: z.any().optional(),
  expenses: z.any().optional(),
  totalRevenue: z.any().optional(),
})

export type CreateIgpSupplyPayload = z.infer<typeof createIgpSupplySchema>
export type UpdateIgpSupplyPayload = z.infer<typeof updateIgpSupplySchema>
