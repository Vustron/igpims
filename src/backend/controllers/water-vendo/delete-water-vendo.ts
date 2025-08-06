import { waterVendo } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function deleteWaterVendo(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const vendoId = searchParams.get("id")

    if (!vendoId) {
      return NextResponse.json(
        { error: "Water vendo ID is required" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const vendoResult = await tx.query.waterVendo.findFirst({
        where: eq(waterVendo.id, vendoId),
      })

      if (!vendoResult) {
        throw new Error("Water vendo not found")
      }

      await Promise.all([
        tx.delete(waterVendo).where(eq(waterVendo.id, vendoId)),
        activityLogger({
          userId: currentSession.userId,
          action: `${currentSession.userName} has deleted a water vendo for: ${waterVendo.waterVendoLocation}`,
        }),
      ])
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
