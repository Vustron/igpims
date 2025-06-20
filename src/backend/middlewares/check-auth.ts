import * as accountQuery from "@/backend/queries/account"
import * as sessionQuery from "@/backend/queries/session"
import * as userQuery from "@/backend/queries/user"
import { catchError } from "@/utils/catch-error"
import { getSession } from "@/config/session"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"

import type { Account, Session, User } from "@/backend/db/schemas"
import { cleanupSession } from "@/backend/helpers/cleanup-session"

export async function checkAuth() {
  try {
    const currentSession = await getSession()
    if (!currentSession?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let sessionData: Session | undefined
    let accountData: Account | undefined
    let userData: User | undefined

    await db.transaction(async (_tx) => {
      const sessionResult = await sessionQuery.findBySessionIdQuery.execute({
        sessionId: currentSession.id,
      })
      sessionData = sessionResult[0] as Session

      if (!sessionData || sessionData.token !== currentSession.token) {
        await userQuery.updateUserSessionExpiredQuery.execute({
          userId: currentSession.userId,
          sessionExpired: true,
          updatedAt: new Date(),
        })
        await cleanupSession()
        throw new Error("Invalid session")
      }

      const accountResult = await accountQuery.findByAccountUserIdQuery.execute(
        {
          accountUserId: currentSession.userId,
        },
      )
      accountData = accountResult[0] as Account

      if (
        !accountData?.accessToken ||
        accountData.accessToken !== sessionData.token
      ) {
        await userQuery.updateUserSessionExpiredQuery.execute({
          userId: currentSession.userId,
          sessionExpired: true,
          updatedAt: new Date(),
        })
        await cleanupSession()
        throw new Error("Invalid session token")
      }

      const now = new Date()
      if (sessionData && new Date(sessionData.expiresAt) < now) {
        await userQuery.updateUserSessionExpiredQuery.execute({
          userId: currentSession.userId,
          sessionExpired: true,
          updatedAt: new Date(),
        })
        await cleanupSession()
        throw new Error("Session expired")
      }

      const userResult = await userQuery.findByUserIdQuery.execute({
        userId: currentSession.userId,
      })
      userData = userResult[0] as User
    })

    if (!userData) {
      await cleanupSession()
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return currentSession
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
