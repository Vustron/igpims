import z from "zod"

export const createWaterSupplySchema = z.object({
  waterVendoId: z.string().length(15),
  supplyDate: z.any().optional(),
  suppliedGallons: z.any().optional(),
  expenses: z.any().optional(),
})

export const updateWaterSupplySchema = z.object({
  waterVendoId: z.string().length(15).optional(),
  supplyDate: z.number().optional(),
  suppliedGallons: z.any().optional(),
  expenses: z.any().optional(),
})

export type CreateWaterSupplyData = z.infer<typeof createWaterSupplySchema>
export type UpdateWaterSupplyData = z.infer<typeof updateWaterSupplySchema>
