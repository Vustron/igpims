import { z } from "zod"

export const createIgpTransactionSchema = z.object({
  igpId: z.string().min(1, "IGP ID is required"),
  igpSupplyId: z.string().min(1, "IGP ID is required"),
  purchaserName: z.string().min(1, "Purchaser name is required"),
  courseAndSet: z.string().min(1, "Course and set is required"),
  batch: z.string(),
  quantity: z.any(),
  dateBought: z.any(),
  itemReceived: z.enum(["pending", "received", "cancelled"]),
})

export const updateIgpTransactionSchema = z.object({
  igpId: z.string().min(1, "IGP ID is required").optional(),
  igpSupplyId: z.string().min(1, "IGP ID is required").optional(),
  purchaserName: z.string().min(1, "Purchaser name is required").optional(),
  courseAndSet: z.string().min(1, "Course and set is required").optional(),
  batch: z.string(),
  quantity: z.any(),
  dateBought: z.any(),
  itemReceived: z.enum(["pending", "received", "cancelled"]).optional(),
})

export type CreateIgpTransactionPayload = z.infer<
  typeof createIgpTransactionSchema
>
export type UpdateIgpTransactionPayload = z.infer<
  typeof updateIgpTransactionSchema
>
