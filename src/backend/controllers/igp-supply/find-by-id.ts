import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findIgpSupplyByIdWithIgpQuery } from "@/backend/queries/igp-supply"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function findIgpSupplyById(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const supplyId = request.nextUrl.searchParams.get("id")
    if (!supplyId) {
      return NextResponse.json(
        { error: "Supply ID is required" },
        { status: 400 },
      )
    }

    const [supply] = await findIgpSupplyByIdWithIgpQuery.execute({
      id: supplyId,
    })

    if (!supply) {
      return NextResponse.json(
        { error: "Supply record not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(supply, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
