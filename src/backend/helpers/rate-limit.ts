import { IncomingMessage } from "node:http"
import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "request-ip"
import { rateLimiter } from "@/config/redis"

export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
  url: string
  method: string
}

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
