import { igp, igpSupply } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyIgpSupply(
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
    const igpId = url.searchParams.get("igpId") || undefined
    const startDate = url.searchParams.get("startDate") || undefined
    const endDate = url.searchParams.get("endDate") || undefined

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push(
        or(
          like(igpSupply.id, `%${search}%`),
          sql`CAST(${igpSupply.quantity} AS TEXT) LIKE ${`%${search}%`}`,
          sql`CAST(${igpSupply.unitPrice} AS TEXT) LIKE ${`%${search}%`}`,
          like(igp.igpName, `%${search}%`),
        ),
      )
    }

    if (igpId) {
      whereConditions.push(eq(igpSupply.igpId, igpId))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      whereConditions.push(
        sql`${igpSupply.supplyDate} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      whereConditions.push(
        sql`${igpSupply.supplyDate} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    const query = db
      .select({
        id: igpSupply.id,
        igpId: igpSupply.igpId,
        supplyDate: sql<number>`${igpSupply.supplyDate}`,
        quantity: igpSupply.quantity,
        quantitySold: igpSupply.quantitySold,
        unitPrice: igpSupply.unitPrice,
        expenses: igpSupply.expenses,
        totalRevenue: igpSupply.totalRevenue,
        createdAt: sql<number>`${igpSupply.createdAt}`,
        updatedAt: sql<number>`${igpSupply.updatedAt}`,
        igpData: {
          id: igp.id,
          igpName: igp.igpName,
          igpType: igp.igpType,
        },
      })
      .from(igpSupply)
      .leftJoin(igp, eq(igpSupply.igpId, igp.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const supplyData = await query
      .orderBy(sql`${igpSupply.supplyDate} DESC`)
      .limit(limit)
      .offset(offset)

    const totalSummaryQuery = db
      .select({
        totalQuantity: sql<number>`sum(${igpSupply.quantity})`,
        totalSold: sql<number>`sum(${igpSupply.quantitySold})`,
        totalExpenses: sql<number>`sum(${igpSupply.expenses})`,
        totalRevenue: sql<number>`sum(${igpSupply.totalRevenue})`,
      })
      .from(igpSupply)
      .leftJoin(igp, eq(igpSupply.igpId, igp.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const totalSummaryResult = await totalSummaryQuery
    const totalQuantity = totalSummaryResult[0]?.totalQuantity || 0
    const totalSold = totalSummaryResult[0]?.totalSold || 0
    const totalExpenses = totalSummaryResult[0]?.totalExpenses || 0
    const totalRevenue = totalSummaryResult[0]?.totalRevenue || 0

    const countWhereConditions: any[] = [...whereConditions]

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(igpSupply)
      .leftJoin(igp, eq(igpSupply.igpId, igp.id))
      .where(
        countWhereConditions.length > 0
          ? and(...countWhereConditions)
          : undefined,
      )

    const countResult = await countQuery
    const totalItems = countResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json(
      {
        data: supplyData,
        summary: {
          totalQuantity,
          totalSold,
          totalExpenses,
          totalRevenue,
        },
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
