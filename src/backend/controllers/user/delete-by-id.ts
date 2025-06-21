import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as sessionQuery from "@/backend/queries/session"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function deleteUserById(
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
    const userId = url.searchParams.get("id")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      )
    }

    let exists = false

    await db.transaction(async (_tx) => {
      const findResult = await userQuery.findByUserIdQuery.execute({ userId })

      if (!findResult[0]) {
        throw new Error("User not found")
      }

      exists = true

      await Promise.all([
        sessionQuery.deleteByUserIdQuery.execute({ userId }),
        accountQuery.deleteByUserIdQuery.execute({ userId }),
        userQuery.deleteByUserIdQuery.execute({ userId }),
      ])
    })

    if (!exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
