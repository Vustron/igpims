import { rateLimiter } from "@/config/redis"
import { CompatibleRequest } from "@/interfaces/request"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "request-ip"

export async function httpRequestLimit(request: NextRequest) {
  try {
    const compatibleRequest: CompatibleRequest = {
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      method: request.method,
    } as CompatibleRequest

    const ipAddress =
      getClientIp(compatibleRequest) ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const { success, reset } = await rateLimiter.limit(ipAddress)

    if (!success) {
      const remainingTime = Math.ceil((reset - Date.now()) / 1000)
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
