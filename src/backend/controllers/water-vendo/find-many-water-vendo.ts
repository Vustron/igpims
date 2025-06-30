import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { waterVendo } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function findManyWaterVendo(
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

    const vendoStatusOptions = [
      "operational",
      "maintenance",
      "out-of-service",
      "offline",
    ] as const
    const waterRefillStatusOptions = ["full", "medium", "low", "empty"] as const

    type VendoStatus = (typeof vendoStatusOptions)[number]
    type WaterRefillStatus = (typeof waterRefillStatusOptions)[number]

    const vendoStatusParam = searchParams.get("vendoStatus")
    const vendoStatus =
      vendoStatusParam &&
      vendoStatusOptions.includes(vendoStatusParam as VendoStatus)
        ? (vendoStatusParam as VendoStatus)
        : undefined

    const waterRefillStatusParam = searchParams.get("waterRefillStatus")
    const waterRefillStatus =
      waterRefillStatusParam &&
      waterRefillStatusOptions.includes(
        waterRefillStatusParam as WaterRefillStatus,
      )
        ? (waterRefillStatusParam as WaterRefillStatus)
        : undefined

    const search = searchParams.get("search") || undefined
    const location = searchParams.get("location") || undefined

    const countResult = await db.transaction(async (_tx) => {
      const conditions = []

      if (vendoStatus) {
        conditions.push(eq(waterVendo.vendoStatus, vendoStatus))
      }

      if (waterRefillStatus) {
        conditions.push(eq(waterVendo.waterRefillStatus, waterRefillStatus))
      }

      if (location) {
        conditions.push(like(waterVendo.waterVendoLocation, `%${location}%`))
      }

      if (search) {
        conditions.push(
          or(
            like(waterVendo.waterVendoLocation, `%${search}%`),
            like(waterVendo.id, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({ count: sql<number>`count(*)` })
        .from(waterVendo)
        .where(conditions.length > 0 ? and(...conditions) : undefined)

      const result = await query
      return result[0]?.count || 0
    })

    const vendos = await db.transaction(async (_tx) => {
      const conditions = []

      if (vendoStatus) {
        conditions.push(eq(waterVendo.vendoStatus, vendoStatus))
      }

      if (waterRefillStatus) {
        conditions.push(eq(waterVendo.waterRefillStatus, waterRefillStatus))
      }

      if (location) {
        conditions.push(like(waterVendo.waterVendoLocation, `%${location}%`))
      }

      if (search) {
        conditions.push(
          or(
            like(waterVendo.waterVendoLocation, `%${search}%`),
            like(waterVendo.id, `%${search}%`),
          ),
        )
      }

      const query = db
        .select({
          id: waterVendo.id,
          waterVendoLocation: waterVendo.waterVendoLocation,
          gallonsUsed: waterVendo.gallonsUsed,
          vendoStatus: waterVendo.vendoStatus,
          waterRefillStatus: waterVendo.waterRefillStatus,
          createdAt: sql<number>`${waterVendo.createdAt}`,
          updatedAt: sql<number>`${waterVendo.updatedAt}`,
        })
        .from(waterVendo)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${waterVendo.createdAt} DESC`)

      return await query
    })

    const totalItems = countResult
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: vendos,
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
