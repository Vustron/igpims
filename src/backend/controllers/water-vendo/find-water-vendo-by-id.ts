import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as waterVendoQuery from "@/backend/queries/water-vendo"
import { catchError } from "@/utils/catch-error"

export async function findWaterVendoById(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const vendoId = searchParams.get("id")

    if (!vendoId) {
      return NextResponse.json(
        { error: "Water vendo ID is required" },
        { status: 400 },
      )
    }

    const vendoResult = await waterVendoQuery.getWaterVendoByIdQuery.execute({
      id: vendoId,
    })

    if (!vendoResult) {
      return NextResponse.json(
        { error: "Water vendo not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(vendoResult, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
