import z from "zod"

export const InspectionSchema = z.object({
  id: z.string(),
  dateOfInspection: z.number(),
  dateSet: z.number(),
  violators: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  totalFines: z.number(),
})

export type Inspection = z.infer<typeof InspectionSchema>
