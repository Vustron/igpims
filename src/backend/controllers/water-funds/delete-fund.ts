import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { waterFunds } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function deleteWaterFund(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const fundId = searchParams.get("id")

    if (!fundId) {
      return NextResponse.json(
        { error: "Water fund ID is required" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const fundResult = await tx.query.waterFunds.findFirst({
        where: eq(waterFunds.id, fundId),
      })

      if (!fundResult) {
        throw new Error("Water fund not found")
      }

      await tx.delete(waterFunds).where(eq(waterFunds.id, fundId))
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: catchError(error),
        message: "Failed to delete water fund",
      },
      { status: 500 },
    )
  }
}
