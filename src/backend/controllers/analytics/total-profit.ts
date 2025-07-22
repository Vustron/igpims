import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import {
  getAllIgpRevenue,
  getKeyMetrics,
  getMonthlyRevenueData,
  getTotalProfit,
} from "@/backend/queries/analytics"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function findTotalProfit(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const profitData = await getTotalProfit()
    const igpRevenues = await getAllIgpRevenue()
    const monthlyRevenue = await getMonthlyRevenueData()
    const keyMetrics = await getKeyMetrics()

    return NextResponse.json(
      {
        data: profitData,
        igpRevenues,
        monthlyRevenue,
        keyMetrics,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
