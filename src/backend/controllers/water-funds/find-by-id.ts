import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as waterFundQuery from "@/backend/queries/water-funds"
import { catchError } from "@/utils/catch-error"

export async function findWaterFundById(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const fundId = searchParams.get("id")

    if (!fundId) {
      return NextResponse.json(
        { error: "Water fund ID is required" },
        { status: 400 },
      )
    }

    const fundResult = await waterFundQuery.getWaterFundByIdQuery.execute({
      id: fundId,
    })

    if (!fundResult || fundResult.length === 0) {
      return NextResponse.json(
        { error: "Water fund not found" },
        { status: 404 },
      )
    }

    const fund = {
      ...fundResult[0],
      weekFund: Number(fundResult[0]?.weekFund ?? 0),
      dateFund: Number(fundResult[0]?.dateFund ?? 0),
      createdAt: Number(fundResult[0]?.createdAt ?? 0),
      updatedAt: Number(fundResult[0]?.updatedAt ?? 0),
    }

    return NextResponse.json(fund, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
