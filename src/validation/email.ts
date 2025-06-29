import z from "zod"

export const lockerRentRecipientSchema = z.object({
  renterName: z.string(),
  courseAndSet: z.string(),
  renterEmail: z.string().email(),
  lockerName: z.string(),
  lockerLocation: z.string(),
  notificationType: z
    .enum([
      "rental-confirmation",
      "rental-expiration",
      "rental-cancellation",
      "payment-reminder",
    ])
    .nullish()
    .optional(),
  dueDate: z.any(),
  amount: z.number(),
})

export const recipientSchema = z.object({
  recipients: z.array(z.string()),
})

export type LockerRentEmailPayload = z.infer<typeof lockerRentRecipientSchema>
export type RecipientPayload = z.infer<typeof recipientSchema>
