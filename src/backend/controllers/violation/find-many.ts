import { findManyViolationsQuery } from "@/backend/queries/violation"
import { violation } from "@/backend/db/schemas"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"
import { sql } from "drizzle-orm"

import type { NextRequest } from "next/server"

export async function findManyViolations(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || undefined
    const violationType = searchParams.get("violationType") || undefined
    const fineStatus = searchParams.get("fineStatus") || undefined
    const fromDate = searchParams.get("fromDate")
      ? Number.parseInt(searchParams.get("fromDate")!)
      : undefined
    const toDate = searchParams.get("toDate")
      ? Number.parseInt(searchParams.get("toDate")!)
      : undefined

    const offset = (page - 1) * limit

    const result = await findManyViolationsQuery.execute({
      limit,
      offset,
      search: search ? `%${search}%` : undefined,
      violationType,
      fineStatus,
      fromDate,
      toDate,
    })

    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(violation)
    const totalItems = Number(countResult[0]?.count || 0)

    return NextResponse.json({
      data: result,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
