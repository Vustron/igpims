import z from "zod"

export const ViolationSchema = z.object({
  id: z.string().optional(),
  lockerId: z.string().min(1, "Locker ID is required"),
  inspectionId: z.string().min(1, "Inspection ID is required"),
  studentName: z.string().min(1, "Student name is required"),
  violations: z.any(),
  dateOfInspection: z.any(),
  datePaid: z.any(),
  totalFine: z.number().min(1, "Fine cannot be negative"),
  fineStatus: z
    .enum(["paid", "unpaid", "partial", "waived", "under_review"])
    .default("unpaid")
    .optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
})

export type Violation = z.infer<typeof ViolationSchema>
