import { igp, igpTransactions } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyIgpTransactions(
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
    const purchaserName = url.searchParams.get("purchaserName") || undefined
    const courseAndSet = url.searchParams.get("courseAndSet") || undefined
    const batch = url.searchParams.get("batch") || undefined
    const startDate = url.searchParams.get("startDate") || undefined
    const endDate = url.searchParams.get("endDate") || undefined
    const itemReceived = url.searchParams.get("itemReceived") || undefined

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push(
        or(
          like(igpTransactions.id, `%${search}%`),
          like(igpTransactions.purchaserName, `%${search}%`),
          like(igpTransactions.courseAndSet, `%${search}%`),
          like(igpTransactions.batch, `%${search}%`),
          like(igp.igpName, `%${search}%`),
        ),
      )
    }

    if (igpId) {
      whereConditions.push(eq(igpTransactions.igpId, igpId))
    }

    if (purchaserName) {
      whereConditions.push(
        like(igpTransactions.purchaserName, `%${purchaserName}%`),
      )
    }

    if (courseAndSet) {
      whereConditions.push(
        like(igpTransactions.courseAndSet, `%${courseAndSet}%`),
      )
    }

    if (batch && batch !== "N/A") {
      whereConditions.push(like(igpTransactions.batch, `%${batch}%`))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      whereConditions.push(
        sql`${igpTransactions.dateBought} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      whereConditions.push(
        sql`${igpTransactions.dateBought} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    if (itemReceived) {
      whereConditions.push(
        eq(
          igpTransactions.itemReceived,
          itemReceived as "pending" | "received" | "cancelled",
        ),
      )
    }

    const query = db
      .select({
        id: igpTransactions.id,
        igpId: igpTransactions.igpId,
        purchaserName: igpTransactions.purchaserName,
        courseAndSet: igpTransactions.courseAndSet,
        batch: igpTransactions.batch,
        quantity: igpTransactions.quantity,
        dateBought: sql<number>`${igpTransactions.dateBought}`,
        itemReceived: igpTransactions.itemReceived,
        createdAt: sql<number>`${igpTransactions.createdAt}`,
        updatedAt: sql<number>`${igpTransactions.updatedAt}`,
        igpData: {
          id: igp.id,
          igpName: igp.igpName,
          igpType: igp.igpType,
          costPerItem: igp.costPerItem,
        },
      })
      .from(igpTransactions)
      .leftJoin(igp, eq(igpTransactions.igpId, igp.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const transactionsData = await query
      .orderBy(sql`${igpTransactions.dateBought} DESC`)
      .limit(limit)
      .offset(offset)

    const totalAmountQuery = db
      .select({
        totalAmount: sql<number>`sum(${igpTransactions.quantity} * ${igp.costPerItem})`,
        totalQuantity: sql<number>`sum(${igpTransactions.quantity})`,
      })
      .from(igpTransactions)
      .leftJoin(igp, eq(igpTransactions.igpId, igp.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const totalAmountResult = await totalAmountQuery
    const totalAmount = totalAmountResult[0]?.totalAmount || 0
    const totalQuantity = totalAmountResult[0]?.totalQuantity || 0

    const countWhereConditions: any[] = [...whereConditions]

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(igpTransactions)
      .leftJoin(igp, eq(igpTransactions.igpId, igp.id))
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
        data: transactionsData,
        summary: {
          totalAmount,
          totalQuantity,
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
