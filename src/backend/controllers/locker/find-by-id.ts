import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import * as lockerQuery from "@/backend/queries/locker"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"

import type { NextRequest } from "next/server"

export async function findLockerById(
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

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Locker ID is required" },
        { status: 400 },
      )
    }

    const locker = await db.transaction(async (_tx) => {
      const result = await lockerQuery.getLockerByIdQuery.execute({
        id,
      })
      return result[0]
    })

    if (!locker) {
      return NextResponse.json({ error: "Locker not found" }, { status: 404 })
    }

    return NextResponse.json(locker, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: catchError(error) || "Failed to find locker" },
      { status: 500 },
    )
  }
}
