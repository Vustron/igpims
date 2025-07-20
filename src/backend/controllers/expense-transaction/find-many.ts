import { expenseTransaction, fundRequest, user } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { getTotalProfit } from "@/backend/queries/analytics"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, inArray, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyExpenseTransaction(
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
    const requestId = url.searchParams.get("requestId") || undefined

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push(
        or(
          like(expenseTransaction.id, `%${search}%`),
          like(expenseTransaction.expenseName, `%${search}%`),
          like(fundRequest.purpose, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (status) {
      whereConditions.push(eq(expenseTransaction.status, status as any))
    }

    if (requestId) {
      whereConditions.push(eq(expenseTransaction.requestId, requestId))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      whereConditions.push(
        sql`${expenseTransaction.date} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      whereConditions.push(
        sql`${expenseTransaction.date} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    const query = db
      .select({
        id: expenseTransaction.id,
        requestId: expenseTransaction.requestId,
        expenseName: expenseTransaction.expenseName,
        amount: expenseTransaction.amount,
        date: sql<number>`${expenseTransaction.date}`,
        receipt: expenseTransaction.receipt,
        status: expenseTransaction.status,
        validatedBy: expenseTransaction.validatedBy,
        validatedDate: sql<number>`${expenseTransaction.validatedDate}`,
        rejectionReason: expenseTransaction.rejectionReason,
        createdAt: sql<number>`${expenseTransaction.createdAt}`,
        updatedAt: sql<number>`${expenseTransaction.updatedAt}`,
        requestData: {
          id: fundRequest.id,
          purpose: fundRequest.purpose,
          amount: fundRequest.amount,
          status: fundRequest.status,
          requestor: fundRequest.requestor,
          requestorPosition: fundRequest.requestorPosition,
        },
      })
      .from(expenseTransaction)
      .leftJoin(user, eq(expenseTransaction.validatedBy, user.id))
      .leftJoin(fundRequest, eq(expenseTransaction.requestId, fundRequest.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const expenseTransactionsData = await query
      .orderBy(sql`${expenseTransaction.date} DESC`)
      .limit(limit)
      .offset(offset)

    const requestorIds = Array.from(
      new Set(
        expenseTransactionsData
          .map((t) => t.requestData?.requestor)
          .filter(Boolean) as string[],
      ),
    )

    const requestors =
      requestorIds.length > 0
        ? await db.select().from(user).where(inArray(user.id, requestorIds))
        : []

    const requestorMap = new Map<string, (typeof requestors)[0]>()
    requestors.forEach((r) => requestorMap.set(r.id, r))

    const transactions = expenseTransactionsData.map((t) => ({
      ...t,
      requestorData: t.requestData?.requestor
        ? requestorMap.get(t.requestData.requestor)
        : undefined,
    }))

    const countWhereConditions: any[] = []

    if (search) {
      countWhereConditions.push(
        or(
          like(expenseTransaction.id, `%${search}%`),
          like(expenseTransaction.expenseName, `%${search}%`),
          like(fundRequest.purpose, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (status) {
      countWhereConditions.push(eq(expenseTransaction.status, status as any))
    }

    if (requestId) {
      countWhereConditions.push(eq(expenseTransaction.requestId, requestId))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      countWhereConditions.push(
        sql`${expenseTransaction.date} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      countWhereConditions.push(
        sql`${expenseTransaction.date} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(expenseTransaction)
      .leftJoin(fundRequest, eq(expenseTransaction.requestId, fundRequest.id))
      .leftJoin(user, eq(expenseTransaction.validatedBy, user.id))
      .where(
        countWhereConditions.length > 0
          ? and(...countWhereConditions)
          : undefined,
      )

    const countResult = await countQuery
    const totalItems = countResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / limit)

    const profitData = await getTotalProfit()

    return NextResponse.json(
      {
        data: transactions,
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
