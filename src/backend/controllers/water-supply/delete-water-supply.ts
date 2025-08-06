import { waterSupply } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function deleteWaterSupply(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const supplyId = searchParams.get("id")

    if (!supplyId) {
      return NextResponse.json(
        { error: "Water supply ID is required" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const supplyResult = await tx.query.waterSupply.findFirst({
        where: eq(waterSupply.id, supplyId),
      })

      if (!supplyResult) {
        throw new Error("Water supply not found")
      }
      await Promise.all([
        tx.delete(waterSupply).where(eq(waterSupply.id, supplyId)),
        activityLogger({
          userId: currentSession.userId,
          action: `${currentSession.userName} has created a water supply for: ${supplyResult.waterVendoId}`,
        }),
      ])
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
