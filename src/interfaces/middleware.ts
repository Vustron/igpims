import { NextRequest, NextResponse } from "next/server"

export type MiddlewareConfig = {
  enabled: boolean
  handler: (request: NextRequest) => Promise<NextResponse | undefined>
}

export type RequestHandlerConfig = {
  middleware?: MiddlewareConfig
}
