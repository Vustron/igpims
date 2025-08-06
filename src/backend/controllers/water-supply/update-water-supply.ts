import { waterSupply, waterVendo } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateWaterSupplyData,
  updateWaterSupplySchema,
} from "@/validation/water-supply"
import { and, eq, not } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function updateWaterSupply(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const supplyId = url.searchParams.get("id")

    if (!supplyId) {
      return NextResponse.json(
        { error: "Water supply ID is required" },
        { status: 400 },
      )
    }

    const existingSupply = await db
      .select({
        id: waterSupply.id,
        waterVendoId: waterSupply.waterVendoId,
        supplyDate: waterSupply.supplyDate,
        suppliedGallons: waterSupply.suppliedGallons,
        expenses: waterSupply.expenses,
        usedGallons: waterSupply.usedGallons,
        remainingGallons: waterSupply.remainingGallons,
        createdAt: waterSupply.createdAt,
        updatedAt: waterSupply.updatedAt,
        vendoLocation: waterVendo.waterVendoLocation,
      })
      .from(waterSupply)
      .leftJoin(waterVendo, eq(waterSupply.waterVendoId, waterVendo.id))
      .where(eq(waterSupply.id, supplyId))
      .then((rows) => rows[0])

    if (!existingSupply) {
      return NextResponse.json(
        { error: "Water supply not found" },
        { status: 404 },
      )
    }

    const data = await requestJson<UpdateWaterSupplyData>(request)
    const validationResult = await updateWaterSupplySchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const supplyData = validationResult.data

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (
      supplyData.waterVendoId !== undefined &&
      supplyData.waterVendoId !== existingSupply.waterVendoId
    ) {
      updateData.waterVendoId = supplyData.waterVendoId
    }

    if (supplyData.supplyDate !== undefined) {
      const newSupplyDate = new Date(supplyData.supplyDate)
      if (newSupplyDate.getTime() !== existingSupply.supplyDate.getTime()) {
        const vendoIdToCheck =
          supplyData.waterVendoId || existingSupply.waterVendoId

        const conflictingSupply = await db
          .select()
          .from(waterSupply)
          .where(
            and(
              eq(waterSupply.waterVendoId, vendoIdToCheck),
              eq(waterSupply.supplyDate, newSupplyDate),
              not(eq(waterSupply.id, supplyId)),
            ),
          )
          .then((rows) => rows[0])

        if (conflictingSupply) {
          return NextResponse.json(
            {
              error:
                "A supply record already exists for this vendo on the specified date",
            },
            { status: 409 },
          )
        }

        updateData.supplyDate = newSupplyDate
      }
    }

    if (
      supplyData.suppliedGallons !== undefined &&
      supplyData.suppliedGallons !== existingSupply.suppliedGallons
    ) {
      updateData.suppliedGallons = supplyData.suppliedGallons
      updateData.remainingGallons =
        supplyData.suppliedGallons - existingSupply.usedGallons
    }

    if (
      supplyData.expenses !== undefined &&
      supplyData.expenses !== existingSupply.expenses
    ) {
      updateData.expenses = supplyData.expenses
    }

    if (Object.keys(updateData).length > 1) {
      await db
        .update(waterSupply)
        .set(updateData)
        .where(eq(waterSupply.id, supplyId))
    }

    const updatedSupply = await db
      .select({
        id: waterSupply.id,
        waterVendoId: waterSupply.waterVendoId,
        supplyDate: waterSupply.supplyDate,
        suppliedGallons: waterSupply.suppliedGallons,
        expenses: waterSupply.expenses,
        usedGallons: waterSupply.usedGallons,
        remainingGallons: waterSupply.remainingGallons,
        createdAt: waterSupply.createdAt,
        updatedAt: waterSupply.updatedAt,
        vendoLocation: waterVendo.waterVendoLocation,
      })
      .from(waterSupply)
      .leftJoin(waterVendo, eq(waterSupply.waterVendoId, waterVendo.id))
      .where(eq(waterSupply.id, supplyId))
      .then((rows) => rows[0])

    if (!updatedSupply) {
      return NextResponse.json(
        { error: "Failed to update water supply" },
        { status: 500 },
      )
    }

    const responseSupply = {
      ...updatedSupply,
      supplyDate: Number(updatedSupply?.supplyDate ?? 0),
      createdAt: Number(updatedSupply?.createdAt ?? 0),
      updatedAt: Number(updatedSupply?.updatedAt ?? 0),
    }

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has updated a water supply for: ${responseSupply.vendoLocation}`,
    })

    return NextResponse.json(responseSupply, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
