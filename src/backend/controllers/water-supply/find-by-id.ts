import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as waterSupplyQuery from "@/backend/queries/water-supply"
import { catchError } from "@/utils/catch-error"

export async function findWaterSupplyById(
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

    const supplyResult = await waterSupplyQuery.getWaterSupplyByIdQuery.execute(
      {
        id: supplyId,
      },
    )

    if (!supplyResult || supplyResult.length === 0) {
      return NextResponse.json(
        { error: "Water supply not found" },
        { status: 404 },
      )
    }

    const supply = {
      ...supplyResult[0],
      supplyDate: Number(supplyResult[0]?.supplyDate ?? 0),
      createdAt: Number(supplyResult[0]?.createdAt ?? 0),
      updatedAt: Number(supplyResult[0]?.updatedAt ?? 0),
    }

    return NextResponse.json(supply, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
