"use server"

import * as sessionQuery from "@/backend/queries/session"
import * as userQuery from "@/backend/queries/user"
import { getSession } from "@/config/session"

export async function cleanupSession() {
  const currentSession = await getSession()
  await Promise.all([
    sessionQuery.deleteBySessionIdQuery.execute({
      sessionId: currentSession.id,
    }),
    userQuery.updateUserSessionExpiredQuery.execute({
      userId: currentSession.userId,
      sessionExpired: false,
      updatedAt: new Date(),
    }),
  ])
  return currentSession.destroy()
}
