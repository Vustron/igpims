import z from "zod"

export const createWaterSupplySchema = z.object({
  waterVendoId: z.string().length(15),
  supplyDate: z.number(),
  suppliedGallons: z.number().positive(),
  expenses: z.number().nonnegative(),
})

export const updateWaterSupplySchema = z.object({
  waterVendoId: z.string().length(15).optional(),
  supplyDate: z.number().optional(),
  suppliedGallons: z.number().positive().optional(),
  expenses: z.number().nonnegative().optional(),
})

export type CreateWaterSupplyData = z.infer<typeof createWaterSupplySchema>
export type UpdateWaterSupplyData = z.infer<typeof updateWaterSupplySchema>
