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

export const updateRentalSchema = z.object({
  lockerId: z.string().min(1, "Locker ID is required").optional(),
  renterId: z.string().min(1, "Student ID is required").optional(),
  renterName: z.string().min(1, "Student name is required").optional(),
  courseAndSet: z.string().min(1, "Course and set is required").optional(),
  renterEmail: z.string().email("Invalid email format").optional(),
  rentalStatus: z
    .enum(["active", "pending", "expired", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["paid", "pending", "partial", "overdue"]).optional(),
  dateRented: z.any().optional(),
  dateDue: z.any().optional(),
  remarks: z.string().optional(),
  violationCount: z.number().min(0).optional(),
  finesDue: z.number().min(0).optional(),
  finesPaid: z.number().min(0).optional(),
  lastInspectionDate: z.any().optional(),
  extensionCount: z.number().min(0).optional(),
})

export type CreateRentalData = z.infer<typeof createRentalSchema>
export type UpdateRentalData = z.infer<typeof updateRentalSchema>
