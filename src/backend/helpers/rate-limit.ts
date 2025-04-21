import { rateLimiter } from "@/config/redis"
import { NextResponse } from "next/server"
import { getClientIp } from "request-ip"

import type { IncomingMessage } from "node:http"
import type { NextRequest } from "next/server"

export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
  url: string
  method: string
}

/**
 * Rate limits requests based on client IP
 * @param request - NextRequest object
 * @returns RateLimitResponse or NextResponse with 429 status
 */
export async function rateLimit(request: NextRequest) {
  const compatibleRequest: CompatibleRequest = {
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url,
    method: request.method,
  } as CompatibleRequest

  const clientIp = getClientIp(compatibleRequest) || "NA"

  const limit = await rateLimiter.get({
    id: clientIp,
  })

  if (!limit.remaining) {
    return NextResponse.json(
      {
        error: "Sorry, you are rate limited. Wait for 10 seconds",
      },
      { status: 429 },
    )
  }

  return { clientIp, compatibleRequest }
}
