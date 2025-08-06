import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as waterVendoQuery from "@/backend/queries/water-vendo"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateWaterVendoData,
  createWaterVendoSchema,
} from "@/validation/water-vendo"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function createWaterVendo(request: NextRequest) {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<CreateWaterVendoData>(request)
    const validationResult = createWaterVendoSchema.safeParse(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const vendoData = validationResult.data

    const existingVendo =
      await waterVendoQuery.getWaterVendoByLocationQuery.execute({
        waterVendoLocation: vendoData.waterVendoLocation,
      })

    if (existingVendo) {
      return NextResponse.json(
        { error: "A water vendo already exists at this location" },
        { status: 409 },
      )
    }

    const result = await waterVendoQuery.createWaterVendoQuery.execute({
      id: nanoid(15),
      waterVendoLocation: vendoData.waterVendoLocation,
      gallonsUsed: vendoData.gallonsUsed,
      vendoStatus: vendoData.vendoStatus,
      waterRefillStatus: vendoData.waterRefillStatus,
    })

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has created a water vendo for: ${result[0]?.waterVendoLocation!}`,
    })

    return NextResponse.json(result[0], {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
