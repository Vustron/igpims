import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as waterFundQuery from "@/backend/queries/water-funds"
import * as waterSupplyQuery from "@/backend/queries/water-supply"
import * as waterVendoQuery from "@/backend/queries/water-vendo"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateWaterFundData,
  createWaterFundSchema,
} from "@/validation/water-fund"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function createWaterFund(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<CreateWaterFundData>(request)
    const validationResult = createWaterFundSchema.safeParse(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const fundData = validationResult.data

    const existingVendo = await waterVendoQuery.getWaterVendoByIdQuery.execute({
      id: fundData.waterVendoId,
    })

    if (!existingVendo) {
      return NextResponse.json(
        { error: "Water vendo not found" },
        { status: 404 },
      )
    }

    const existingFund = await waterFundQuery.getWaterFundByWeekQuery.execute({
      waterVendoId: fundData.waterVendoId,
      weekFund: fundData.weekFund,
    })

    if (existingFund[0]) {
      return NextResponse.json(
        { error: "Fund record already exists for this week" },
        { status: 409 },
      )
    }

    const supplyResult =
      await waterSupplyQuery.getWaterSupplyByWaterVendoIdQuery.execute({
        waterVendoId: fundData.waterVendoId,
      })

    if (!supplyResult[0]) {
      return NextResponse.json(
        { error: "Water supply not found" },
        { status: 409 },
      )
    }

    const expenses = Number(supplyResult[0]?.expenses) || 0
    const revenue = Number(fundData.waterFundsRevenue) || 0
    const profit = revenue - expenses

    if (Number.isNaN(profit)) {
      return NextResponse.json(
        { error: "Invalid profit calculation" },
        { status: 400 },
      )
    }

    const result = await waterFundQuery.createWaterFundQuery.execute({
      id: nanoid(15),
      waterVendoId: fundData.waterVendoId,
      waterVendoLocation: existingVendo[0]?.waterVendoLocation || "",
      usedGallons: Number(existingVendo[0]?.gallonsUsed) || 0,
      waterFundsExpenses: expenses,
      waterFundsRevenue: revenue,
      waterFundsProfit: profit,
      weekFund: fundData.weekFund,
      dateFund: fundData.dateFund,
    })

    const fundResult = await waterFundQuery.getWaterFundByIdQuery.execute({
      id: result[0]?.id,
    })

    if (!fundResult || fundResult.length === 0) {
      return NextResponse.json(
        { error: "Water fund not found" },
        { status: 404 },
      )
    }

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has created a water fund for: ${fundResult[0]?.vendoLocation}`,
    })

    return NextResponse.json(fundResult[0], {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
