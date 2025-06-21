import { IncomingMessage } from "node:http"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "request-ip"
import { RateLimit, rateLimit } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
  url: string
  method: string
}

export async function httpRequestLimit(request: NextRequest) {
  try {
    const compatibleRequest: CompatibleRequest = {
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      method: request.method,
    } as CompatibleRequest

    const MAX_ATTEMPTS = 10
    const WINDOW_TIME = 20 * 1000
    const timestamp = Date.now()
    const ipAddress =
      getClientIp(compatibleRequest) ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"

    let rateLimitData: RateLimit | undefined
    let isLimited = false

    await db.transaction(async (tx) => {
      const result = await db
        .select()
        .from(rateLimit)
        .where(eq(rateLimit.ipAddress, ipAddress))

      rateLimitData = result[0] as RateLimit

      if (!rateLimitData) {
        await tx.insert(rateLimit).values({
          id: nanoid(),
          ipAddress,
          attempts: 1,
          resetAt: new Date(timestamp + WINDOW_TIME),
          createdAt: new Date(timestamp),
          updatedAt: new Date(timestamp),
        })
        return
      }

      if (timestamp > rateLimitData.resetAt.getTime()) {
        await tx
          .update(rateLimit)
          .set({
            attempts: 1,
            resetAt: new Date(timestamp + WINDOW_TIME),
            updatedAt: new Date(timestamp),
          })
          .where(eq(rateLimit.ipAddress, ipAddress))
        return
      }

      if (rateLimitData.attempts >= MAX_ATTEMPTS) {
        isLimited = true
        return
      }

      await tx
        .update(rateLimit)
        .set({
          attempts: rateLimitData.attempts + 1,
          updatedAt: new Date(timestamp),
        })
        .where(eq(rateLimit.ipAddress, ipAddress))
    })

    if (isLimited && rateLimitData) {
      const remainingTime = Math.ceil(
        (rateLimitData.resetAt.getTime() - timestamp) / 1000,
      )
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please try again in ${remainingTime} seconds.`,
          remainingTime,
        },
        { status: 429 },
      )
    }
    return undefined
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
