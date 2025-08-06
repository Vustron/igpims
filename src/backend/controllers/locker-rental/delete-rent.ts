import { locker, lockerRental } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { getRentalByIdQuery } from "@/backend/queries/rental"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

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

    await db.transaction(async (tx): Promise<{ success: boolean }> => {
      const rental = await tx
        .select({ lockerId: lockerRental.lockerId })
        .from(lockerRental)
        .where(sql`${lockerRental.id} = ${rentalId}`)
        .get()

      if (!rental) {
        throw new Error("Rental not found")
      }

      await Promise.all([
        tx
          .update(locker)
          .set({ lockerStatus: "available" })
          .where(sql`${locker.id} = ${rental.lockerId}`)
          .run(),
        tx
          .delete(lockerRental)
          .where(sql`${lockerRental.id} = ${rentalId}`)
          .run(),
      ])

      return { success: true }
    })

    const rentalResult = await getRentalByIdQuery.execute({
      id: rentalId,
    })

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has deleted a locker rent: ${rentalResult[0]?.renterName}`,
    })

    return NextResponse.json(rentalResult, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
