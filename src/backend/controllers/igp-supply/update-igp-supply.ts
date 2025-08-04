import { igp, igpSupply } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findIgpByIdQuery } from "@/backend/queries/igp"
import { findIgpSupplyByIdWithIgpQuery } from "@/backend/queries/igp-supply"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateIgpSupplyPayload,
  updateIgpSupplySchema,
} from "@/validation/igp-supply"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function updateIgpSupply(
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
      return NextResponse.json(
        { error: "Supply ID is required" },
        { status: 400 },
      )
    }

    const data = await requestJson<Partial<UpdateIgpSupplyPayload>>(request)

    if (data.supplyDate !== undefined) {
      if (typeof data.supplyDate === "number") {
        data.supplyDate = new Date(data.supplyDate)
      } else if (typeof data.supplyDate === "string") {
        data.supplyDate = new Date(data.supplyDate)
      }
    }

    const validationResult = await updateIgpSupplySchema
      .partial()
      .safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const [existingSupply] = await findIgpSupplyByIdWithIgpQuery.execute({
      id,
    })

    if (!existingSupply) {
      return NextResponse.json(
        { error: "Supply record not found" },
        { status: 404 },
      )
    }

    const [igpData] = await findIgpByIdQuery.execute({
      id: existingSupply.igpId,
    })

    if (!igpData) {
      return NextResponse.json(
        { error: "Associated IGP not found" },
        { status: 404 },
      )
    }

    const updatedSupply = await db.transaction(async (tx) => {
      const updateValues: Partial<UpdateIgpSupplyPayload> = {}

      if (data.igpId !== undefined) updateValues.igpId = data.igpId
      if (data.supplyDate !== undefined)
        updateValues.supplyDate = data.supplyDate
      if (data.quantity !== undefined) updateValues.quantity = data.quantity
      if (data.quantitySold !== undefined)
        updateValues.quantitySold = data.quantitySold
      if (data.unitPrice !== undefined) updateValues.unitPrice = data.unitPrice
      if (data.expenses !== undefined) updateValues.expenses = data.expenses
      if (data.totalRevenue !== undefined)
        updateValues.totalRevenue = data.totalRevenue

      if (Object.keys(updateValues).length === 0) {
        return existingSupply
      }

      const [updated] = await tx
        .update(igpSupply)
        .set(updateValues)
        .where(eq(igpSupply.id, id))
        .returning()

      if (!updated) {
        throw new Error("Failed to update supply record")
      }

      const quantitySoldDiff =
        data.quantitySold !== undefined
          ? data.quantitySold - existingSupply.quantitySold
          : 0
      const revenueDiff =
        data.totalRevenue !== undefined
          ? data.totalRevenue - existingSupply.totalRevenue
          : 0

      if (quantitySoldDiff !== 0 || revenueDiff !== 0) {
        await tx
          .update(igp)
          .set({
            totalSold: sql`${igpData.totalSold} + ${quantitySoldDiff}`,
            igpRevenue: sql`${igpData.igpRevenue} + ${revenueDiff}`,
          })
          .where(eq(igp.id, existingSupply.igpId))
      }

      return updated
    })

    const [newSupplyData] = await findIgpSupplyByIdWithIgpQuery.execute({
      id: updatedSupply?.id,
    })

    if (!newSupplyData) {
      return NextResponse.json(
        { error: "Supply record not found after update" },
        { status: 404 },
      )
    }

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has updated an igp supply: ${newSupplyData.igp?.igpName}`,
    })

    return NextResponse.json(newSupplyData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
