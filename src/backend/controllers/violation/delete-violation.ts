import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import {
  deleteViolationQuery,
  findViolationByIdQuery,
} from "@/backend/queries/violation"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function deleteViolation(
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

    return await db.transaction(async (_tx) => {
      const existingViolation = await findViolationByIdQuery.execute({
        id: userId,
      })

      if (!existingViolation.length) {
        return NextResponse.json(
          { error: "Violation not found" },
          { status: 404 },
        )
      }

      await deleteViolationQuery.execute({ id: userId })

      return NextResponse.json({ status: 201 })
    })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
