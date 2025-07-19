import { z } from "zod"

export const createIgpTransactionSchema = z.object({
  igpId: z.string().min(1, "IGP ID is required"),
  purchaserName: z.string().min(1, "Purchaser name is required"),
  courseAndSet: z.string().min(1, "Course and set is required"),
  batch: z.string().optional().default("N/A"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  dateBought: z.number().optional().default(Date.now()),
  itemReceived: z
    .enum(["pending", "received", "cancelled"])
    .optional()
    .default("pending"),
})

export const updateIgpTransactionSchema = z.object({
  purchaserName: z.string().min(1, "Purchaser name is required").optional(),
  courseAndSet: z.string().min(1, "Course and set is required").optional(),
  batch: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  dateBought: z.any().optional(),
  itemReceived: z.enum(["pending", "received", "cancelled"]).optional(),
})

export type CreateIgpTransactionPayload = z.infer<
  typeof createIgpTransactionSchema
>
export type UpdateIgpTransactionPayload = z.infer<
  typeof updateIgpTransactionSchema
>
