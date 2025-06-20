import z from "zod"

export const ViolationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  violations: z.string(),
  violationType: z.enum([
    "lost_key",
    "damaged_locker",
    "unauthorized_use",
    "prohibited_items",
    "late_renewal",
    "abandoned_items",
    "other",
  ]),
  dateOfInspection: z.number(),
  dateReported: z.number(),
  totalFine: z.number(),
  amountPaid: z.number().optional(),
  fineStatus: z.enum(["paid", "unpaid", "partial", "waived", "under_review"]),
  lockerId: z.string(),
  description: z.string().optional(),
  reportedBy: z.string(),
  evidence: z.array(z.string()).optional(),
  resolutionNotes: z.string().optional(),
})

export type Violation = z.infer<typeof ViolationSchema>
