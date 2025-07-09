import { waterFunds, waterVendo } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyWaterFunds(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = (page - 1) * limit

    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const vendoId = searchParams.get("vendoId")
    const search = searchParams.get("search") || undefined

    const countResult = await db.transaction(async (_tx) => {
      const conditions = []

      if (vendoId) {
        conditions.push(eq(waterFunds.waterVendoId, vendoId))
      }

      if (startDate && endDate) {
        conditions.push(
          and(
            sql`${waterFunds.dateFund} >= ${new Date(startDate).getTime()}`,
            sql`${waterFunds.dateFund} <= ${new Date(endDate).getTime()}`,
          ),
        )
      } else if (startDate) {
        conditions.push(
          sql`${waterFunds.dateFund} >= ${new Date(startDate).getTime()}`,
        )
      } else if (endDate) {
        conditions.push(
          sql`${waterFunds.dateFund} <= ${new Date(endDate).getTime()}`,
        )
      }

      if (search) {
        conditions.push(
          or(
            like(waterVendo.waterVendoLocation, `%${search}%`),
            like(waterFunds.id, `%${search}%`),
            like(waterFunds.waterVendoLocation, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({ count: sql<number>`count(*)` })
        .from(waterFunds)
        .leftJoin(waterVendo, eq(waterFunds.waterVendoId, waterVendo.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)

      const result = await query
      return result[0]?.count || 0
    })

    const funds = await db.transaction(async (_tx) => {
      const conditions = []

      if (vendoId) {
        conditions.push(eq(waterFunds.waterVendoId, vendoId))
      }

      if (startDate && endDate) {
        conditions.push(
          and(
            sql`${waterFunds.dateFund} >= ${new Date(startDate).getTime()}`,
            sql`${waterFunds.dateFund} <= ${new Date(endDate).getTime()}`,
          ),
        )
      } else if (startDate) {
        conditions.push(
          sql`${waterFunds.dateFund} >= ${new Date(startDate).getTime()}`,
        )
      } else if (endDate) {
        conditions.push(
          sql`${waterFunds.dateFund} <= ${new Date(endDate).getTime()}`,
        )
      }

      if (search) {
        conditions.push(
          or(
            like(waterVendo.waterVendoLocation, `%${search}%`),
            like(waterFunds.id, `%${search}%`),
            like(waterFunds.waterVendoLocation, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({
          id: waterFunds.id,
          waterVendoId: waterFunds.waterVendoId,
          waterVendoLocation: waterFunds.waterVendoLocation,
          usedGallons: waterFunds.usedGallons,
          waterFundsExpenses: waterFunds.waterFundsExpenses,
          waterFundsRevenue: waterFunds.waterFundsRevenue,
          waterFundsProfit: waterFunds.waterFundsProfit,
          weekFund: sql<number>`${waterFunds.weekFund}`,
          dateFund: sql<number>`${waterFunds.dateFund}`,
          vendoLocation: waterVendo.waterVendoLocation,
          createdAt: sql<number>`${waterFunds.createdAt}`,
          updatedAt: sql<number>`${waterFunds.updatedAt}`,
        })
        .from(waterFunds)
        .leftJoin(waterVendo, eq(waterFunds.waterVendoId, waterVendo.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${waterFunds.dateFund} DESC`)

      return await query
    })

    const totalItems = countResult
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: funds,
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
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
