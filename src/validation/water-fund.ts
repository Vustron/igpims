import z from "zod"

export const createWaterFundSchema = z.object({
  waterVendoId: z.string().max(15).optional(),
  waterVendoLocation: z.string().max(15).optional(),
  usedGallons: z.any().optional(),
  waterFundsExpenses: z.any().optional(),
  waterFundsRevenue: z.any().optional(),
  waterFundsProfit: z.any().optional(),
  weekFund: z.any().optional(),
  dateFund: z.any().optional(),
})

export const updateWaterFundSchema = z.object({
  waterVendoId: z.string().max(15).optional(),
  waterVendoLocation: z.string().max(15).optional(),
  usedGallons: z.any().optional(),
  waterFundsExpenses: z.any().optional(),
  waterFundsRevenue: z.any().optional(),
  waterFundsProfit: z.any().optional(),
  weekFund: z.any().optional(),
  dateFund: z.any().optional(),
})

export type CreateWaterFundData = z.infer<typeof createWaterFundSchema>
export type UpdateWaterFundData = z.infer<typeof updateWaterFundSchema>
