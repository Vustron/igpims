import { sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { locker, lockerRental } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function findManyRenterInfo(
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

    const result = await db
      .select({
        renterId: lockerRental.renterId,
        renterName: lockerRental.renterName,
        courseAndSet: lockerRental.courseAndSet,
        renterEmail: lockerRental.renterEmail,
        lockerName: locker.lockerName,
        lockerLocation: locker.lockerLocation,
        dueDate: sql<number>`${lockerRental.dateDue}`,
        amount: locker.lockerRentalPrice,
      })
      .from(lockerRental)
      .innerJoin(locker, sql`${lockerRental.lockerId} = ${locker.id}`)
      .orderBy(sql`${lockerRental.createdAt} DESC`)
      .all()

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
