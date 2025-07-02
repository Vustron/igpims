import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { waterSupply } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

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

      await tx.delete(waterSupply).where(eq(waterSupply.id, supplyId))
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: catchError(error),
        message: "Failed to delete water supply",
      },
      { status: 500 },
    )
  }
}
