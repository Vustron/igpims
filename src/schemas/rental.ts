import z from "zod"

export const createRentalSchema = z.object({
  lockerId: z.string().min(1, "Locker ID is required").optional(),
  renterId: z.string().min(1, "Student ID is required").optional(),
  renterName: z.string().min(1, "Student name is required").optional(),
  courseAndSet: z.string().min(1, "Course and set is required").optional(),
  renterEmail: z.string().email().optional(),
  rentalStatus: z
    .enum(["active", "pending", "expired", "cancelled"])
    .default("active")
    .optional(),
  paymentStatus: z
    .enum(["paid", "pending", "partial", "overdue"])
    .default("pending")
    .optional(),
  dateRented: z.any().optional(),
  dateDue: z.any().optional(),
})

export type CreateRentalData = z.infer<typeof createRentalSchema>
