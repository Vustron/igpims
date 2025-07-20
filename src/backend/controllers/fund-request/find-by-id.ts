import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { getTotalProfit } from "@/backend/queries/analytics"
import { findFundRequestByIdQuery } from "@/backend/queries/fund-request"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function findFundRequestById(
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
        { error: "Fund Request ID is required" },
        { status: 400 },
      )
    }

    const fundRequestData = await db.transaction(async (_tx) => {
      const requestResult = await findFundRequestByIdQuery.execute({
        id: id,
      })

      return requestResult[0] || null
    })

    if (!fundRequestData) {
      return NextResponse.json(
        { error: "Fund Request not found" },
        { status: 404 },
      )
    }

    const profitData = await getTotalProfit()

    const fundRequestDataWithProfitData = {
      ...fundRequestData,
      profitData,
    }

    return NextResponse.json(fundRequestDataWithProfitData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
