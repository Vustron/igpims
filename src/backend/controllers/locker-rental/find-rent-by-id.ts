import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as rentalQuery from "@/backend/queries/rental"
import { catchError } from "@/utils/catch-error"

export async function findRentById(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) {
      return currentSession
    }

    const searchParams = request.nextUrl.searchParams
    const rentalId = searchParams.get("id")

    if (!rentalId) {
      return NextResponse.json(
        { error: "Rental ID is required" },
        { status: 400 },
      )
    }

    const rentalResult = await rentalQuery.getRentalByIdQuery.execute({
      id: rentalId,
    })

    const rental = rentalResult[0]
    if (!rental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 })
    }

    const lockerResult = await rentalQuery.getLockerByRentalIdQuery.execute({
      id: rentalId,
    })

    const locker = lockerResult[0]

    const rentalWithLocker = {
      ...rental,
      locker: locker || null,
    }

    return NextResponse.json(rentalWithLocker, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
