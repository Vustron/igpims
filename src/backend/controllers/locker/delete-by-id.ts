import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as lockerQuery from "@/backend/queries/locker"
import * as rentalQuery from "@/backend/queries/rental"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function deleteLockerById(
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
    const lockerId = url.searchParams.get("id")

    if (!lockerId) {
      return NextResponse.json(
        { error: "Locker ID is required" },
        { status: 400 },
      )
    }

    let deletedLocker = null

    await db.transaction(async (_tx) => {
      const findResult = await lockerQuery.getLockerByIdQuery.execute({
        id: lockerId,
      })

      if (!findResult[0]) {
        throw new Error("Locker not found")
      }

      deletedLocker = findResult[0]

      const rentalsResult = await rentalQuery.getRentalsByLockerIdQuery.execute(
        {
          lockerId: lockerId,
        },
      )

      if (rentalsResult && rentalsResult.length > 0) {
        for (const rental of rentalsResult) {
          await rentalQuery.deleteRentalQuery.execute({ id: rental.id })
        }
      }

      await Promise.all([
        lockerQuery.deleteLockerQuery.execute({ id: lockerId }),
        activityLogger({
          userId: currentSession.userId,
          action: `${currentSession.userName} has deleted a locker: ${deletedLocker.lockerName}`,
        }),
      ])
    })

    if (!deletedLocker) {
      return NextResponse.json({ error: "Locker not found" }, { status: 404 })
    }

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
