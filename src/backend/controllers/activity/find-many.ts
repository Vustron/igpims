import { activity, user } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyActivity(
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
    const userId = url.searchParams.get("userId") || undefined
    const action = url.searchParams.get("action") || undefined
    const startDate = url.searchParams.get("startDate") || undefined
    const endDate = url.searchParams.get("endDate") || undefined

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push(
        or(
          like(activity.id, `%${search}%`),
          like(activity.userId, `%${search}%`),
          like(activity.action, `%${search}%`),
          like(user.name, `%${search}%`),
          like(user.email, `%${search}%`),
        ),
      )
    }

    if (userId) {
      whereConditions.push(eq(activity.userId, userId))
    }

    if (action) {
      whereConditions.push(like(activity.action, `%${action}%`))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      whereConditions.push(
        sql`${activity.createdAt} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      whereConditions.push(
        sql`${activity.createdAt} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    const query = db
      .select({
        id: activity.id,
        userId: activity.userId,
        action: activity.action,
        createdAt: sql<number>`${activity.createdAt}`,
        userData: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      })
      .from(activity)
      .leftJoin(user, eq(activity.userId, user.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const activitiesData = await query
      .orderBy(sql`${activity.createdAt} DESC`)
      .limit(limit)
      .offset(offset)

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(activity)
      .leftJoin(user, eq(activity.userId, user.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const countResult = await countQuery
    const totalItems = countResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json(
      {
        data: activitiesData,
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
