import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findIgpByIdQuery } from "@/backend/queries/igp"
import {
  findIgpSupplyByIdWithIgpQuery,
  insertIgpSupplyQuery,
} from "@/backend/queries/igp-supply"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateIgpSupplyPayload,
  createIgpSupplySchema,
} from "@/validation/igp-supply"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function createIgpSupply(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<CreateIgpSupplyPayload>(request)
    const validationResult = await createIgpSupplySchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const supplyData = validationResult.data

    const [existingIgp] = await findIgpByIdQuery.execute({
      id: supplyData.igpId,
    })

    if (!existingIgp) {
      return NextResponse.json({ error: "IGP not found" }, { status: 404 })
    }

    const newSupply = await db.transaction(async (_tx) => {
      const [insertedSupply] = await insertIgpSupplyQuery.execute({
        id: nanoid(15),
        igpId: supplyData.igpId,
        supplyDate: supplyData.supplyDate,
        quantity: supplyData.quantity,
        quantitySold: supplyData.quantitySold || 0,
        unitPrice: supplyData.unitPrice,
        expenses: supplyData.expenses || 0,
        totalRevenue: supplyData.totalRevenue || 0,
      })

      return insertedSupply
    })

    const [newSupplyData] = await findIgpSupplyByIdWithIgpQuery.execute({
      id: newSupply?.id,
    })

    if (!newSupplyData) {
      return NextResponse.json(
        { error: "Supply not found after creation" },
        { status: 404 },
      )
    }

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has created an igp supply: ${newSupplyData.igp?.igpName}`,
    })

    return NextResponse.json(newSupplyData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
