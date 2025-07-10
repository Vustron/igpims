import { fundRequest } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyFundRequest(
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
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 10
    const offset = (page - 1) * limit

    const fundRequestsData = await db
      .select({
        id: fundRequest.id,
        purpose: fundRequest.purpose,
        amount: fundRequest.amount,
        utilizedFunds: fundRequest.utilizedFunds,
        allocatedFunds: fundRequest.allocatedFunds,
        status: fundRequest.status,
        requestedBy: fundRequest.requestedBy,
        requestorPosition: fundRequest.requestorPosition,
        requestDate: fundRequest.requestDate,
        dateNeeded: fundRequest.dateNeeded,
        createdAt: fundRequest.createdAt,
        updatedAt: fundRequest.updatedAt,
      })
      .from(fundRequest)
      .orderBy(sql`${fundRequest.requestDate} DESC`)
      .limit(limit)
      .offset(offset)

    const fundRequests = fundRequestsData.map((req) => ({
      ...req,
      requestDate: new Date(req.requestDate).getTime(),
      dateNeeded: new Date(req.dateNeeded).getTime(),
      createdAt: Math.floor(new Date(req.createdAt).getTime() / 1000),
      updatedAt: Math.floor(new Date(req.updatedAt).getTime() / 1000),
    }))

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(fundRequest)

    const totalItems = countResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json(
      {
        data: fundRequests,
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
