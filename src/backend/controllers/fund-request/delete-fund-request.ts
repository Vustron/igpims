import { fundRequest } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function deleteFundRequest(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get("id")

    if (!requestId) {
      return NextResponse.json(
        { error: "Fund Request ID is required" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const fundRequestResult = await tx.query.fundRequest.findFirst({
        where: eq(fundRequest.id, requestId),
      })

      if (!fundRequestResult) {
        throw new Error("Fund Request not found")
      }

      await tx.delete(fundRequest).where(eq(fundRequest.id, requestId))
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
