import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { lockerRental } from "@/backend/db/schemas"
import { and, eq, like, or, sql } from "drizzle-orm"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"

import type { NextRequest } from "next/server"

export async function findManyRents(
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
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    const rentalStatusOptions = [
      "active",
      "pending",
      "expired",
      "cancelled",
    ] as const
    const paymentStatusOptions = [
      "paid",
      "pending",
      "partial",
      "overdue",
    ] as const

    type RentalStatus = (typeof rentalStatusOptions)[number]
    type PaymentStatus = (typeof paymentStatusOptions)[number]

    const rentalStatusParam = searchParams.get("rentalStatus")
    const rentalStatus =
      rentalStatusParam &&
      rentalStatusOptions.includes(rentalStatusParam as RentalStatus)
        ? (rentalStatusParam as RentalStatus)
        : undefined

    const paymentStatusParam = searchParams.get("paymentStatus")
    const paymentStatus =
      paymentStatusParam &&
      paymentStatusOptions.includes(paymentStatusParam as PaymentStatus)
        ? (paymentStatusParam as PaymentStatus)
        : undefined

    const search = searchParams.get("search") || undefined
    const renterName = searchParams.get("renterName") || undefined
    const courseAndSet = searchParams.get("courseAndSet") || undefined

    const countResult = await db.transaction(async (_tx) => {
      const conditions = []

      if (rentalStatus) {
        conditions.push(eq(lockerRental.rentalStatus, rentalStatus))
      }

      if (paymentStatus) {
        conditions.push(eq(lockerRental.paymentStatus, paymentStatus))
      }

      if (renterName) {
        conditions.push(like(lockerRental.renterName, `%${renterName}%`))
      }

      if (courseAndSet) {
        conditions.push(like(lockerRental.courseAndSet, `%${courseAndSet}%`))
      }

      if (search) {
        conditions.push(
          or(
            like(lockerRental.renterName, `%${search}%`),
            like(lockerRental.courseAndSet, `%${search}%`),
            like(lockerRental.renterId, `%${search}%`),
            like(lockerRental.lockerId, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({ count: sql<number>`count(*)` })
        .from(lockerRental)
        .where(conditions.length > 0 ? and(...conditions) : undefined)

      const result = await query
      return result[0]?.count || 0
    })

    const rentals = await db.transaction(async (_tx) => {
      const conditions = []

      if (rentalStatus) {
        conditions.push(eq(lockerRental.rentalStatus, rentalStatus))
      }

      if (paymentStatus) {
        conditions.push(eq(lockerRental.paymentStatus, paymentStatus))
      }

      if (renterName) {
        conditions.push(like(lockerRental.renterName, `%${renterName}%`))
      }

      if (courseAndSet) {
        conditions.push(like(lockerRental.courseAndSet, `%${courseAndSet}%`))
      }

      if (search) {
        conditions.push(
          or(
            like(lockerRental.renterName, `%${search}%`),
            like(lockerRental.courseAndSet, `%${search}%`),
            like(lockerRental.renterId, `%${search}%`),
            like(lockerRental.lockerId, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({
          id: lockerRental.id,
          lockerId: lockerRental.lockerId,
          renterId: lockerRental.renterId,
          renterName: lockerRental.renterName,
          courseAndSet: lockerRental.courseAndSet,
          rentalStatus: lockerRental.rentalStatus,
          paymentStatus: lockerRental.paymentStatus,
          dateRented: sql<number>`${lockerRental.dateRented}`,
          dateDue: sql<number>`${lockerRental.dateDue}`,
          createdAt: sql<number>`${lockerRental.createdAt}`,
          updatedAt: sql<number>`${lockerRental.updatedAt}`,
        })
        .from(lockerRental)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${lockerRental.createdAt} DESC`)

      return await query
    })

    const totalItems = countResult
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: rentals,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: catchError(error) || "Failed to retrieve rentals" },
      { status: 500 },
    )
  }
}
