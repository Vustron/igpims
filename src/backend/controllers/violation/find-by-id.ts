import { NextRequest, NextResponse } from "next/server"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findViolationByIdQuery } from "@/backend/queries/violation"
import { db } from "@/config/drizzle"
import { getSession } from "@/config/session"
import { catchError } from "@/utils/catch-error"

export async function findViolationById(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const currentSession = await getSession()
    if (!currentSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = new URL(request.url).searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Violation ID is required" },
        { status: 400 },
      )
    }

    const result = await db.transaction(async (_tx) => {
      const violation = await findViolationByIdQuery.execute({ id })
      return violation[0]
    })

    if (!result) {
      return NextResponse.json(
        { error: "Violation not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
