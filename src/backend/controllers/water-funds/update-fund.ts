import { and, eq, not } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { waterFunds, waterVendo } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateWaterFundData,
  updateWaterFundSchema,
} from "@/validation/water-fund"

export async function updateWaterFund(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const fundId = url.searchParams.get("id")

    if (!fundId) {
      return NextResponse.json(
        { error: "Water fund ID is required" },
        { status: 400 },
      )
    }

    const existingFund = await db
      .select({
        id: waterFunds.id,
        waterVendoId: waterFunds.waterVendoId,
        waterVendoLocation: waterFunds.waterVendoLocation,
        usedGallons: waterFunds.usedGallons,
        waterFundsExpenses: waterFunds.waterFundsExpenses,
        waterFundsRevenue: waterFunds.waterFundsRevenue,
        waterFundsProfit: waterFunds.waterFundsProfit,
        weekFund: waterFunds.weekFund,
        dateFund: waterFunds.dateFund,
        createdAt: waterFunds.createdAt,
        updatedAt: waterFunds.updatedAt,
        vendoLocation: waterVendo.waterVendoLocation,
      })
      .from(waterFunds)
      .leftJoin(waterVendo, eq(waterFunds.waterVendoId, waterVendo.id))
      .where(eq(waterFunds.id, fundId))
      .then((rows) => rows[0])

    if (!existingFund) {
      return NextResponse.json(
        { error: "Water fund not found" },
        { status: 404 },
      )
    }

    const data = await requestJson<UpdateWaterFundData>(request)
    const validationResult = await updateWaterFundSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const fundData = validationResult.data

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (
      fundData.waterVendoId !== undefined &&
      fundData.waterVendoId !== existingFund.waterVendoId
    ) {
      updateData.waterVendoId = fundData.waterVendoId
    }

    if (
      fundData.waterVendoLocation !== undefined &&
      fundData.waterVendoLocation !== existingFund.waterVendoLocation
    ) {
      updateData.waterVendoLocation = fundData.waterVendoLocation
    }

    if (fundData.weekFund !== undefined) {
      const newWeekFund = new Date(fundData.weekFund)
      if (newWeekFund.getTime() !== existingFund.weekFund.getTime()) {
        const vendoIdToCheck =
          fundData.waterVendoId || existingFund.waterVendoId

        const conflictingFund = await db
          .select()
          .from(waterFunds)
          .where(
            and(
              eq(waterFunds.waterVendoId, vendoIdToCheck),
              eq(waterFunds.weekFund, newWeekFund),
              not(eq(waterFunds.id, fundId)),
            ),
          )
          .then((rows) => rows[0])

        if (conflictingFund) {
          return NextResponse.json(
            {
              error:
                "A fund record already exists for this vendo on the specified week",
            },
            { status: 409 },
          )
        }

        updateData.weekFund = newWeekFund
      }
    }

    if (fundData.dateFund !== undefined) {
      updateData.dateFund = new Date(fundData.dateFund)
    }

    if (
      fundData.usedGallons !== undefined &&
      fundData.usedGallons !== existingFund.usedGallons
    ) {
      updateData.usedGallons = fundData.usedGallons
    }

    if (
      fundData.waterFundsExpenses !== undefined &&
      fundData.waterFundsExpenses !== existingFund.waterFundsExpenses
    ) {
      updateData.waterFundsExpenses = fundData.waterFundsExpenses
      updateData.waterFundsProfit =
        existingFund.waterFundsRevenue - fundData.waterFundsExpenses
    }

    if (
      fundData.waterFundsRevenue !== undefined &&
      fundData.waterFundsRevenue !== existingFund.waterFundsRevenue
    ) {
      updateData.waterFundsRevenue = fundData.waterFundsRevenue
      updateData.waterFundsProfit =
        fundData.waterFundsRevenue -
        (updateData.waterFundsExpenses ?? existingFund.waterFundsExpenses)
    }

    if (Object.keys(updateData).length > 1) {
      await db
        .update(waterFunds)
        .set(updateData)
        .where(eq(waterFunds.id, fundId))
    }

    const updatedFund = await db
      .select({
        id: waterFunds.id,
        waterVendoId: waterFunds.waterVendoId,
        waterVendoLocation: waterFunds.waterVendoLocation,
        usedGallons: waterFunds.usedGallons,
        waterFundsExpenses: waterFunds.waterFundsExpenses,
        waterFundsRevenue: waterFunds.waterFundsRevenue,
        waterFundsProfit: waterFunds.waterFundsProfit,
        weekFund: waterFunds.weekFund,
        dateFund: waterFunds.dateFund,
        createdAt: waterFunds.createdAt,
        updatedAt: waterFunds.updatedAt,
        vendoLocation: waterVendo.waterVendoLocation,
      })
      .from(waterFunds)
      .leftJoin(waterVendo, eq(waterFunds.waterVendoId, waterVendo.id))
      .where(eq(waterFunds.id, fundId))
      .then((rows) => rows[0])

    if (!updatedFund) {
      return NextResponse.json(
        { error: "Failed to update water fund" },
        { status: 500 },
      )
    }

    const responseFund = {
      ...updatedFund,
      weekFund: Number(updatedFund?.weekFund ?? 0),
      dateFund: Number(updatedFund?.dateFund ?? 0),
      createdAt: Number(updatedFund?.createdAt ?? 0),
      updatedAt: Number(updatedFund?.updatedAt ?? 0),
    }

    return NextResponse.json(responseFund, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
