import { fundRequest } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { toTimestamp } from "@/utils/date-convert"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findFundRequestById(
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
        { error: "Fund Request ID is required" },
        { status: 400 },
      )
    }

    const fundRequestData = await db.transaction(async (_tx) => {
      const requestResult = await db
        .select()
        .from(fundRequest)
        .where(eq(fundRequest.id, id))
        .limit(1)

      return requestResult[0] || null
    })

    if (!fundRequestData) {
      return NextResponse.json(
        { error: "Fund Request not found" },
        { status: 404 },
      )
    }

    const formattedRequest = {
      ...fundRequestData,
      requestDate: toTimestamp(fundRequestData.requestDate),
      dateNeeded: toTimestamp(fundRequestData.dateNeeded),
      createdAt: toTimestamp(fundRequestData.createdAt),
      updatedAt: toTimestamp(fundRequestData.updatedAt),
    }

    return NextResponse.json(formattedRequest, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
