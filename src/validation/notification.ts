import { z } from "zod"

export const updateNotificationSchema = z.object({
  status: z.any(),
})

export type UpdateNotificationPayload = z.infer<typeof updateNotificationSchema>
