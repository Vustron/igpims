import { nanoid } from "nanoid"
import { insertActivityQuery } from "../queries/activity"

interface ActivityLoggerParams {
  userId: string
  action: string
}

export async function activityLogger(params: ActivityLoggerParams) {
  try {
    const result = await insertActivityQuery.execute({
      ...params,
      id: nanoid(15),
      userId: params.userId,
      action: params.action,
    })
    return result
  } catch (error) {
    console.error(`Failed to create notification: ${error}`)
    throw error
  }
}
