import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import * as lockerQuery from "@/backend/queries/locker"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"

import type { NextRequest } from "next/server"

export async function deleteLockerById(
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
    const lockerId = url.searchParams.get("id")

    if (!lockerId) {
      return NextResponse.json(
        { error: "Locker ID is required" },
        { status: 400 },
      )
    }

    let exists = false

    await db.transaction(async (_tx) => {
      const findResult = await lockerQuery.getLockerByIdQuery.execute({
        id: lockerId,
      })

      if (!findResult[0]) {
        throw new Error("Locker not found")
      }

      exists = true

      await lockerQuery.deleteLockerQuery.execute({ id: lockerId })
    })

    if (!exists) {
      return NextResponse.json({ error: "Locker not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Locker deleted successfully" },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
