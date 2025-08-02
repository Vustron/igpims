import { z } from "zod"

export const updateNotificationSchema = z.object({
  status: z.enum(["unread", "read"]).optional(),
})

export type UpdateNotificationPayload = z.infer<typeof updateNotificationSchema>
