import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as waterSupplyQuery from "@/backend/queries/water-supply"
import * as waterVendoQuery from "@/backend/queries/water-vendo"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateWaterSupplyData,
  createWaterSupplySchema,
} from "@/validation/water-supply"

export async function createWaterSupply(request: NextRequest) {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<CreateWaterSupplyData>(request)
    const validationResult = createWaterSupplySchema.safeParse(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const supplyData = validationResult.data

    const existingVendo = await waterVendoQuery.getWaterVendoByIdQuery.execute({
      id: supplyData.waterVendoId,
    })

    if (!existingVendo) {
      return NextResponse.json(
        { error: "Water vendo not found" },
        { status: 404 },
      )
    }

    const existingSupply =
      await waterSupplyQuery.getWaterSupplyByDateQuery.execute({
        waterVendoId: supplyData.waterVendoId,
        supplyDate: supplyData.supplyDate,
      })

    if (existingSupply[0]) {
      return NextResponse.json(
        { error: "Supply record already exists for this date" },
        { status: 409 },
      )
    }

    const result = await waterSupplyQuery.createWaterSupplyQuery.execute({
      id: nanoid(15),
      waterVendoId: supplyData.waterVendoId,
      supplyDate: supplyData.supplyDate,
      suppliedGallons: supplyData.suppliedGallons,
      expenses: supplyData.expenses,
      usedGallons: existingVendo[0]?.gallonsUsed,
      remainingGallons: supplyData.suppliedGallons,
    })

    return NextResponse.json(result[0], {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
