import { compareSync } from "bcrypt-ts"
import { NextRequest, NextResponse } from "next/server"
import { env } from "@/config/env"
import { MiddlewareConfig } from "@/interfaces/middleware"

export const appApiKey: MiddlewareConfig = {
  enabled: true,
  handler: async (request: NextRequest) => {
    const encryptedLocalApiKey = request.headers.get("X-App-API-Key")

    if (!encryptedLocalApiKey) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const secretKey = env.NEXT_PUBLIC_APP_API_KEY

    if (!secretKey) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 },
      )
    }

    try {
      const isValid = compareSync(secretKey, encryptedLocalApiKey)

      if (!isValid) {
        return NextResponse.json(
          { message: "Invalid API key" },
          { status: 401 },
        )
      }

      return undefined
    } catch (error) {
      return NextResponse.json(
        { message: "Authentication error" },
        { status: 500 },
      )
    }
  },
}
