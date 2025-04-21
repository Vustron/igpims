import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import * as userQuery from "@/backend/queries/user"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"

import type { User } from "@/schemas/drizzle-schema"
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

    let usersData: User[] = []

    await db.transaction(async (_tx) => {
      const result =
        await userQuery.FindManyButExcludeCurrentUserQuery.execute()
      usersData = result as User[]
    })

    return NextResponse.json(usersData, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
