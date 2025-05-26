import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql, ne } from "drizzle-orm"
import { user } from "@/schemas/drizzle-schema"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"

import type { NextRequest } from "next/server"

export async function findManyUser(
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

    const search = searchParams.get("search") || undefined
    const role = searchParams.get("role") || undefined

    const currentUserId = currentSession.userId

    const countResult = await db.transaction(async (_tx) => {
      const conditions = [ne(user.id, currentUserId)]

      if (search) {
        conditions.push(
          or(like(user.name, `%${search}%`), like(user.email, `%${search}%`))!,
        )
      }

      if (role && (role === "admin" || role === "user")) {
        conditions.push(eq(user.role, role))
      }

      const query = db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .where(and(...conditions))

      const result = await query
      return result[0]?.count || 0
    })

    const usersData = await db.transaction(async (_tx) => {
      const conditions = [ne(user.id, currentUserId)]

      if (search) {
        conditions.push(
          or(like(user.name, `%${search}%`), like(user.email, `%${search}%`))!,
        )
      }

      if (role && (role === "admin" || role === "user")) {
        conditions.push(eq(user.role, role))
      }

      const query = db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          sessionExpired: user.sessionExpired,
          role: user.role,
          image: user.image,
          createdAt: sql<number>`${user.createdAt}`,
          updatedAt: sql<number>`${user.updatedAt}`,
        })
        .from(user)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${user.createdAt} DESC`)

      return await query
    })

    const totalItems = countResult
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json(
      {
        data: usersData,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
