import { and, between, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { violation } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function findManyViolations(
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

    const fineStatusOptions = [
      "paid",
      "unpaid",
      "partial",
      "waived",
      "under_review",
    ] as const

    type FineStatus = (typeof fineStatusOptions)[number]

    const fineStatusParam = searchParams.get("fineStatus")
    const fineStatus =
      fineStatusParam &&
      fineStatusOptions.includes(fineStatusParam as FineStatus)
        ? (fineStatusParam as FineStatus)
        : undefined

    const search = searchParams.get("search") || undefined
    const studentName = searchParams.get("studentName") || undefined
    const fromDate = searchParams.get("fromDate")
      ? new Date(searchParams.get("fromDate")!).getTime()
      : undefined
    const toDate = searchParams.get("toDate")
      ? new Date(searchParams.get("toDate")!).getTime()
      : undefined

    const countResult = await db.transaction(async (_tx) => {
      const conditions = []

      if (fineStatus) {
        conditions.push(eq(violation.fineStatus, fineStatus))
      }

      if (studentName) {
        conditions.push(like(violation.studentName, `%${studentName}%`))
      }

      if (fromDate && toDate) {
        conditions.push(
          between(
            violation.dateOfInspection,
            new Date(fromDate),
            new Date(toDate),
          ),
        )
      }

      if (search) {
        conditions.push(
          or(
            like(violation.studentName, `%${search}%`),
            like(violation.lockerId, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({ count: sql<number>`count(*)` })
        .from(violation)
        .where(conditions.length > 0 ? and(...conditions) : undefined)

      const result = await query
      return result[0]?.count || 0
    })

    const violationsData = await db.transaction(async (_tx) => {
      const conditions = []

      if (fineStatus) {
        conditions.push(eq(violation.fineStatus, fineStatus))
      }

      if (studentName) {
        conditions.push(like(violation.studentName, `%${studentName}%`))
      }

      if (fromDate && toDate) {
        conditions.push(
          between(
            violation.dateOfInspection,
            new Date(fromDate),
            new Date(toDate),
          ),
        )
      }

      if (search) {
        conditions.push(
          or(
            like(violation.studentName, `%${search}%`),
            like(violation.lockerId, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({
          id: violation.id,
          lockerId: violation.lockerId,
          inspectionId: violation.inspectionId,
          studentName: violation.studentName,
          violations: violation.violations,
          dateOfInspection: sql<number>`${violation.dateOfInspection}`,
          datePaid: sql<number>`${violation.datePaid}`,
          totalFine: violation.totalFine,
          fineStatus: violation.fineStatus,
          createdAt: sql<number>`${violation.createdAt}`,
          updatedAt: sql<number>`${violation.updatedAt}`,
        })
        .from(violation)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${violation.dateOfInspection} DESC`)

      return await query
    })

    const totalItems = countResult
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: violationsData,
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
      { error: catchError(error) || "Failed to retrieve violations" },
      { status: 500 },
    )
  }
}
