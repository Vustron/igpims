import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { getIgpFinancialData } from "@/backend/queries/analytics"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function getFinancialData(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const financialData = await getIgpFinancialData()

    return NextResponse.json({ data: financialData }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
