import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as lockerQuery from "@/backend/queries/locker"
import * as rentalQuery from "@/backend/queries/rental"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function deleteRentById(
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

    const result = await db.transaction(async (_tx) => {
      const rentalResult = await rentalQuery.getRentalByIdQuery.execute({
        id: rentalId,
      })

      const rental = rentalResult[0]
      if (!rental) {
        throw new Error("Rental not found")
      }

      const lockerId = rental.lockerId

      await rentalQuery.deleteRentalQuery.execute({
        id: rentalId,
      })

      if (lockerId) {
        await lockerQuery.updateLockerStatusQuery.execute({
          id: lockerId,
          status: "available",
        })
      }

      return {
        id: rentalId,
        lockerId,
        message: "Rental deleted successfully",
      }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
