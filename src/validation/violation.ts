import z from "zod"

export const ViolationSchema = z.object({
  id: z.string().optional(),
  lockerId: z.string().min(1, "Locker ID is required"),
  studentName: z.string().min(1, "Student name is required"),
  violations: z.any(),
  dateOfInspection: z.any(),
  totalFine: z.number().min(0, "Fine cannot be negative"),
  fineStatus: z
    .enum(["paid", "unpaid", "partial", "waived", "under_review"])
    .default("unpaid")
    .optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

export type Violation = z.infer<typeof ViolationSchema>
