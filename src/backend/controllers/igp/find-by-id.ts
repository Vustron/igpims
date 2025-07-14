import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findIgpByIdQuery } from "@/backend/queries/igp"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function findIgpById(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "IGP ID is required" }, { status: 400 })
    }

    const igpData = await db.transaction(async (_tx) => {
      const igpResult = await findIgpByIdQuery.execute({
        id: id,
      })

      return igpResult[0] || null
    })

    if (!igpData) {
      return NextResponse.json({ error: "IGP not found" }, { status: 404 })
    }

    return NextResponse.json(igpData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
