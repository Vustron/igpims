import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as lockerQuery from "@/backend/queries/locker"
import * as rentalQuery from "@/backend/queries/rental"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { toTimestamp } from "@/utils/date-convert"
import { NextRequest, NextResponse } from "next/server"

export async function findLockerById(
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

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Locker ID is required" },
        { status: 400 },
      )
    }

    const lockerWithRental = await db.transaction(async (_tx) => {
      const lockerResult = await lockerQuery.getLockerByIdQuery.execute({
        id,
      })
      const locker = lockerResult[0]

      if (!locker) {
        return null
      }

      const rentalResult = await rentalQuery.getRentalsByLockerIdQuery.execute({
        lockerId: id,
      })

      const rentalHistory = rentalResult.map((rental) => ({
        ...rental,
        dateRented: toTimestamp(rental.dateRented),
        dateDue: toTimestamp(rental.dateDue),
        createdAt: toTimestamp(rental.createdAt),
        updatedAt: toTimestamp(rental.updatedAt),
      }))

      const currentRental = rentalHistory[0] || null

      const lockerWithTimestamps = {
        ...locker,
      }

      return {
        ...lockerWithTimestamps,
        rental: currentRental,
        rentalHistory: rentalHistory,
      }
    })

    if (!lockerWithRental) {
      return NextResponse.json({ error: "Locker not found" }, { status: 404 })
    }

    return NextResponse.json(lockerWithRental, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
