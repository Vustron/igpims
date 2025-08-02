import { notification, user } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyNotifications(
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
    const type = url.searchParams.get("type") || undefined
    const action = url.searchParams.get("action") || undefined

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push(
        or(
          like(notification.title, `%${search}%`),
          like(notification.description, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (type) {
      whereConditions.push(
        eq(
          notification.type,
          type as "fund_request" | "project_request" | "igp",
        ),
      )
    }

    if (action) {
      whereConditions.push(
        eq(
          notification.action,
          action as
            | "created"
            | "updated"
            | "submitted"
            | "reviewed"
            | "approved"
            | "rejected"
            | "checked"
            | "disbursed"
            | "received"
            | "receipted"
            | "validated"
            | "resolution_created",
        ),
      )
    }

    const query = db
      .select({
        id: notification.id,
        type: notification.type,
        requestId: notification.requestId,
        title: notification.title,
        description: notification.description,
        status: sql<string>`${notification.status}`,
        action: notification.action,
        actor: notification.actor,
        details: notification.details,
        createdAt: sql<number>`${notification.createdAt}`,
        updatedAt: sql<number>`${notification.updatedAt}`,
        actorData: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      })
      .from(notification)
      .leftJoin(user, eq(notification.actor, user.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const rawData = await query
      .orderBy(sql`${notification.createdAt} DESC`)
      .limit(limit)
      .offset(offset)

    const notificationData = rawData.map((item) => ({
      ...item,
      status: JSON.parse(item.status || "[]") as string[],
    }))

    const countWhereConditions: any[] = []

    if (search) {
      countWhereConditions.push(
        or(
          like(notification.title, `%${search}%`),
          like(notification.description, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (type) {
      countWhereConditions.push(
        eq(
          notification.type,
          type as "fund_request" | "project_request" | "igp",
        ),
      )
    }

    if (action) {
      countWhereConditions.push(
        eq(
          notification.action,
          action as
            | "created"
            | "updated"
            | "submitted"
            | "reviewed"
            | "approved"
            | "rejected"
            | "checked"
            | "disbursed"
            | "received"
            | "receipted"
            | "validated"
            | "resolution_created",
        ),
      )
    }

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(notification)
      .leftJoin(user, eq(notification.actor, user.id))
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
        data: notificationData,
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
