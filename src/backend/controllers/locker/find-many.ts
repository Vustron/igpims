import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { locker } from "@/backend/db/schemas"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function findManyLockers(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    const lockerStatusOptions = [
      "available",
      "occupied",
      "reserved",
      "maintenance",
      "out-of-service",
    ] as const

    type LockerStatus = (typeof lockerStatusOptions)[number]

    const statusParam = searchParams.get("status")
    const status =
      statusParam && lockerStatusOptions.includes(statusParam as LockerStatus)
        ? (statusParam as LockerStatus)
        : undefined

    const type = searchParams.get("type") || undefined
    const location = searchParams.get("location") || undefined
    const search = searchParams.get("search") || undefined

    const countResult = await db.transaction(async (_tx) => {
      const conditions = []

      if (status) {
        conditions.push(eq(locker.lockerStatus, status))
      }

      if (type) {
        conditions.push(eq(locker.lockerType, type))
      }

      if (location) {
        conditions.push(like(locker.lockerLocation, `%${location}%`))
      }

      if (search) {
        conditions.push(
          or(
            like(locker.lockerName, `%${search}%`),
            like(locker.lockerLocation, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({ count: sql<number>`count(*)` })
        .from(locker)
        .where(conditions.length > 0 ? and(...conditions) : undefined)

      const result = await query
      return result[0]?.count || 0
    })

    const lockers = await db.transaction(async (_tx) => {
      const conditions = []

      if (status) {
        conditions.push(eq(locker.lockerStatus, status))
      }

      if (type) {
        conditions.push(eq(locker.lockerType, type))
      }

      if (location) {
        conditions.push(like(locker.lockerLocation, `%${location}%`))
      }

      if (search) {
        conditions.push(
          or(
            like(locker.lockerName, `%${search}%`),
            like(locker.lockerLocation, `%${search}%`),
          ),
        )
      }

      const query = db
        .select()
        .from(locker)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(locker.createdAt)

      return await query
    })

    const totalItems = countResult
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json(
      {
        data: lockers,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
