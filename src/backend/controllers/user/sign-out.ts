import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as sessionQuery from "@/backend/queries/session"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function signOutUser(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) {
      return currentSession
    }

    await db.transaction(async (_tx) => {
      await Promise.all([
        sessionQuery.deleteBySessionIdQuery.execute({
          sessionId: currentSession.id,
        }),
        accountQuery.emptyAccountSessionQuery.execute({
          userId: currentSession.userId,
        }),
      ])
      currentSession.destroy()
    })

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has signed out`,
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
