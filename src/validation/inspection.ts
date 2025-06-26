import z from "zod"

export const InspectionSchema = z.object({
  id: z.string(),
  dateOfInspection: z.any(),
  dateSet: z.any(),
  violators: z.any(),
  totalFines: z.number(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
})

export type Inspection = z.infer<typeof InspectionSchema>
