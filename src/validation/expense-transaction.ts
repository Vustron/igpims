import z from "zod"

export const createExpenseTransactionSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  expenseName: z.string().min(1, "Expense name is required"),
  amount: z.number().min(1, "Amount must be positive"),
  date: z.any(),
  receipt: z.any().optional(),
  status: z
    .enum(["pending", "validated", "rejected"])
    .default("pending")
    .optional(),
  rejectionReason: z.any().optional(),
})

export const updateExpenseTransactionSchema = z
  .object({
    id: z.string().min(1, "ID is required").optional(),
    requestId: z.string().min(1, "Request ID is required").optional(),
    expenseName: z.string().min(1, "Expense name is required").optional(),
    amount: z.number().min(1, "Amount must be positive").optional(),
    date: z.any().optional(),
    receipt: z.any().optional(),
    status: z.enum(["pending", "validated", "rejected"]).optional(),
    validatedBy: z.string().optional(),
    validatedDate: z.any().optional(),
    rejectionReason: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "rejected" && !data.rejectionReason) {
        return false
      }
      return true
    },
    {
      message: "Rejection reason is required when status is rejected",
      path: ["rejectionReason"],
    },
  )

export type CreateExpenseTransaction = z.infer<
  typeof createExpenseTransactionSchema
>
export type UpdateExpenseTransaction = z.infer<
  typeof updateExpenseTransactionSchema
>
