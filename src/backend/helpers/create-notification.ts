import {
  NotificationAction,
  NotificationType,
} from "../db/schemas/notification"
import { insertNotificationQuery } from "../queries/notification"

interface CreateNotificationParams {
  id: string
  type: NotificationType
  requestId: string
  title: string
  description: string
  action: NotificationAction
  actorId?: string
  details: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const now = Math.floor(Date.now() / 1000)
    const result = await insertNotificationQuery.execute({
      ...params,
      actor: params.actorId,
      status: [],
      createdAt: now,
      updatedAt: now,
    })
    return result
  } catch (error) {
    console.error(`Failed to create notification: ${error}`)
    throw error
  }
}
