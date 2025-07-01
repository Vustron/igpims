import { z } from "zod"

export const WaterVendoStatus = z.enum([
  "operational",
  "maintenance",
  "out-of-service",
  "offline",
])

export const WaterRefillStatus = z.enum(["full", "medium", "low", "empty"])

export const createWaterVendoSchema = z.object({
  waterVendoLocation: z.string().min(1).max(255),
  gallonsUsed: z.any().optional(),
  vendoStatus: WaterVendoStatus,
  waterRefillStatus: WaterRefillStatus,
})

export const updateWaterVendoSchema = z.object({
  waterVendoLocation: z.string().min(1).max(255).optional(),
  gallonsUsed: z.any().optional(),
  vendoStatus: WaterVendoStatus.optional(),
  waterRefillStatus: WaterRefillStatus.optional(),
})

export type CreateWaterVendoData = z.infer<typeof createWaterVendoSchema>
export type UpdateWaterVendoData = z.infer<typeof updateWaterVendoSchema>
