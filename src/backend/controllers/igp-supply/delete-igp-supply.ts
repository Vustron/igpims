import { igp, igpSupply } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function deleteIgpSupply(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const supplyId = request.nextUrl.searchParams.get("id")
    if (!supplyId) {
      return NextResponse.json(
        { error: "Supply ID is required" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const [existingSupply] = await tx.query.igpSupply.findMany({
        where: eq(igpSupply.id, supplyId),
        with: {
          igp: true,
          transactions: true,
        },
      })

      if (!existingSupply) {
        throw new Error("Supply record not found")
      }

      if (!existingSupply.igp) {
        throw new Error("Associated IGP not found")
      }

      const quantitySoldAdjustment = existingSupply.quantitySold
      const revenueAdjustment = existingSupply.totalRevenue

      await tx.delete(igpSupply).where(eq(igpSupply.id, supplyId))

      if (quantitySoldAdjustment > 0 || revenueAdjustment > 0) {
        await tx
          .update(igp)
          .set({
            totalSold: sql`${existingSupply.igp.totalSold} - ${quantitySoldAdjustment}`,
            igpRevenue: sql`${existingSupply.igp.igpRevenue} - ${revenueAdjustment}`,
          })
          .where(eq(igp.id, existingSupply.igpId))
      }

      await activityLogger({
        userId: currentSession.userId,
        action: `${currentSession.userName} has deleted an igp supply: ${existingSupply.igp.igpName}`,
      })
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
