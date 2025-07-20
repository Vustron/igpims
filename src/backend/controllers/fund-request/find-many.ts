import { fundRequest, user } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { getTotalProfit } from "@/backend/queries/analytics"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyFundRequest(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 10
    const offset = (page - 1) * limit
    const search = url.searchParams.get("search") || ""
    const status = url.searchParams.get("status") || undefined
    const startDate = url.searchParams.get("startDate") || undefined
    const endDate = url.searchParams.get("endDate") || undefined

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push(
        or(
          like(fundRequest.id, `%${search}%`),
          like(fundRequest.purpose, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (status) {
      whereConditions.push(eq(fundRequest.status, status as any))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      whereConditions.push(
        sql`${fundRequest.requestDate} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      whereConditions.push(
        sql`${fundRequest.requestDate} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    const query = db
      .select({
        id: fundRequest.id,
        purpose: fundRequest.purpose,
        amount: fundRequest.amount,
        utilizedFunds: fundRequest.utilizedFunds,
        allocatedFunds: fundRequest.allocatedFunds,
        status: fundRequest.status,
        currentStep: fundRequest.currentStep,
        requestor: fundRequest.requestor,
        requestorPosition: fundRequest.requestorPosition,
        requestDate: sql<number>`${fundRequest.requestDate}`,
        dateNeeded: sql<number>`${fundRequest.dateNeeded}`,
        isRejected: fundRequest.isRejected,
        rejectionStep: fundRequest.rejectionStep,
        rejectionReason: fundRequest.rejectionReason,
        notes: fundRequest.notes,
        reviewerComments: fundRequest.reviewerComments,
        disbursementDate: sql<number>`${fundRequest.disbursementDate}`,
        receiptDate: sql<number>`${fundRequest.receiptDate}`,
        validationDate: sql<number>`${fundRequest.validationDate}`,
        receipts: fundRequest.receipts,
        approvedBy: fundRequest.approvedBy,
        createdAt: sql<number>`${fundRequest.createdAt}`,
        updatedAt: sql<number>`${fundRequest.updatedAt}`,
        requestorData: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
          sessionExpired: user.sessionExpired,
          createdAt: sql<number>`${user.createdAt}`,
          updatedAt: sql<number>`${user.updatedAt}`,
        },
      })
      .from(fundRequest)
      .leftJoin(user, eq(fundRequest.requestor, user.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const fundRequestsData = await query
      .orderBy(sql`${fundRequest.requestDate} DESC`)
      .limit(limit)
      .offset(offset)

    const countWhereConditions: any[] = []

    if (search) {
      countWhereConditions.push(
        or(
          like(fundRequest.id, `%${search}%`),
          like(fundRequest.purpose, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (status) {
      countWhereConditions.push(eq(fundRequest.status, status as any))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      countWhereConditions.push(
        sql`${fundRequest.requestDate} >= ${Math.floor(startDateObj.getTime() / 1000)}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      countWhereConditions.push(
        sql`${fundRequest.requestDate} <= ${Math.floor(endDateObj.getTime() / 1000)}`,
      )
    }

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(fundRequest)
      .leftJoin(user, eq(fundRequest.requestor, user.id))
      .where(
        countWhereConditions.length > 0
          ? and(...countWhereConditions)
          : undefined,
      )
      .orderBy(
        sql`CASE WHEN ${fundRequest.status} = 'pending' THEN 0 ELSE 1 END`,
        sql`${fundRequest.requestDate} DESC`,
      )

    const countResult = await countQuery
    const totalItems = countResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / limit)
    const allUsers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        emailVerified: user.emailVerified,
        sessionExpired: user.sessionExpired,
        createdAt: sql<number>`${user.createdAt}`,
        updatedAt: sql<number>`${user.updatedAt}`,
      })
      .from(user)

    const profitData = await getTotalProfit()

    return NextResponse.json(
      {
        data: fundRequestsData,
        users: allUsers,
        profitData,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
