import { and, eq, not, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { waterVendo } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateWaterVendoData,
  updateWaterVendoSchema,
} from "@/validation/water-vendo"

export async function updateWaterVendo(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const vendoId = url.searchParams.get("id")

    if (!vendoId) {
      return NextResponse.json(
        { error: "Water vendo ID is required" },
        { status: 400 },
      )
    }

    const existingVendo = await db
      .select({
        id: waterVendo.id,
        waterVendoLocation: waterVendo.waterVendoLocation,
        gallonsUsed: waterVendo.gallonsUsed,
        vendoStatus: waterVendo.vendoStatus,
        waterRefillStatus: waterVendo.waterRefillStatus,
        createdAt: sql<number>`${waterVendo.createdAt}`,
        updatedAt: sql<number>`${waterVendo.updatedAt}`,
      })
      .from(waterVendo)
      .where(eq(waterVendo.id, vendoId))
      .then((rows) => rows[0])

    if (!existingVendo) {
      return NextResponse.json(
        { error: "Water vendo not found" },
        { status: 404 },
      )
    }

    const data = await requestJson<UpdateWaterVendoData>(request)
    const validationResult = await updateWaterVendoSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const vendoData = validationResult.data

    if (
      vendoData.waterVendoLocation &&
      vendoData.waterVendoLocation !== existingVendo.waterVendoLocation
    ) {
      const conflictingVendo = await db
        .select()
        .from(waterVendo)
        .where(
          and(
            eq(waterVendo.waterVendoLocation, vendoData.waterVendoLocation),
            not(eq(waterVendo.id, vendoId)),
          ),
        )
        .then((rows) => rows[0])

      if (conflictingVendo) {
        return NextResponse.json(
          { error: "A water vendo already exists at this location" },
          { status: 409 },
        )
      }
    }

    const updateData = {
      ...vendoData,
    }

    await db
      .update(waterVendo)
      .set(updateData)
      .where(eq(waterVendo.id, vendoId))

    const updatedVendo = await db
      .select({
        id: waterVendo.id,
        waterVendoLocation: waterVendo.waterVendoLocation,
        gallonsUsed: waterVendo.gallonsUsed,
        vendoStatus: waterVendo.vendoStatus,
        waterRefillStatus: waterVendo.waterRefillStatus,
        createdAt: sql<number>`${waterVendo.createdAt}`,
        updatedAt: sql<number>`${waterVendo.updatedAt}`,
      })
      .from(waterVendo)
      .where(eq(waterVendo.id, vendoId))
      .then((rows) => rows[0])

    if (!updatedVendo) {
      return NextResponse.json(
        { error: "Failed to update water vendo" },
        { status: 500 },
      )
    }

    return NextResponse.json(updatedVendo, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
