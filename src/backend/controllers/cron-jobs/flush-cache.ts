import { count, lt } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import {
  rateLimit,
  resetToken,
  session,
  verificationToken,
} from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { catchError } from "@/utils/catch-error"

export async function flushCacheCronJob(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const SECRET_KEY = env.SECRET_KEY
    const authHeader = request.headers.get("authorization")
    const ACTION_KEY = authHeader ? authHeader.split(" ")[1] : ""

    if (ACTION_KEY !== SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const [sessions, rateLimits, resetTokens, verificationTokens] =
      await Promise.all([
        db
          .select({ value: count() })
          .from(session)
          .where(lt(session.expiresAt, now)),
        db
          .select({ value: count() })
          .from(rateLimit)
          .where(lt(rateLimit.resetAt, now)),
        db
          .select({ value: count() })
          .from(resetToken)
          .where(lt(resetToken.expires, now)),
        db
          .select({ value: count() })
          .from(verificationToken)
          .where(lt(verificationToken.expires, now)),
      ])

    const totalToDelete =
      (sessions[0]?.value || 0) +
      (rateLimits[0]?.value || 0) +
      (resetTokens[0]?.value || 0) +
      (verificationTokens[0]?.value || 0)

    if (totalToDelete === 0) {
      return NextResponse.json("No cache found to be deleted", { status: 201 })
    }

    let deletedCount = 0

    await db.transaction(async (tx) => {
      const [
        { rowsAffected: expiredSessions },
        { rowsAffected: expiredRateLimits },
        { rowsAffected: expiredResetTokens },
        { rowsAffected: expiredVerificationTokens },
      ] = await Promise.all([
        tx.delete(session).where(lt(session.expiresAt, now)),
        tx.delete(rateLimit).where(lt(rateLimit.resetAt, now)),
        tx.delete(resetToken).where(lt(resetToken.expires, now)),
        tx.delete(verificationToken).where(lt(verificationToken.expires, now)),
      ])

      deletedCount =
        expiredSessions +
        expiredRateLimits +
        expiredResetTokens +
        expiredVerificationTokens
    })

    return NextResponse.json(
      `Successfully cleaned cache, deleted rows: ${deletedCount}`,
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
