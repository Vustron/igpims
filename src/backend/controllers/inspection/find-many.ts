import { sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { inspection } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { countInspectionsQuery } from "@/backend/queries/inspection"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function findManyInspections(
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

    const inspectionsData = await db
      .select({
        id: inspection.id,
        dateOfInspection: inspection.dateOfInspection,
        dateSet: inspection.dateSet,
        totalFines: inspection.totalFines,
        createdAt: inspection.createdAt,
        updatedAt: inspection.updatedAt,
        violators: inspection.violators,
      })
      .from(inspection)
      .orderBy(sql`${inspection.dateOfInspection} DESC`)
      .limit(limit)
      .offset(offset)

    const inspections = inspectionsData.map((insp) => ({
      ...insp,
      dateOfInspection: new Date(insp.dateOfInspection).getTime(),
      dateSet: insp.dateSet ? new Date(insp.dateSet).getTime() : null,
      createdAt: Math.floor(new Date(insp.createdAt).getTime() / 1000),
      updatedAt: Math.floor(new Date(insp.updatedAt).getTime() / 1000),
      violators: (() => {
        try {
          return typeof insp.violators === "string"
            ? JSON.parse(insp.violators).map((v: any) => ({
                id: v.id,
                studentName: v.studentName,
              }))
            : []
        } catch {
          return []
        }
      })(),
    }))

    const countResult = await countInspectionsQuery.execute()
    const totalItems = countResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json(
      {
        data: inspections,
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
