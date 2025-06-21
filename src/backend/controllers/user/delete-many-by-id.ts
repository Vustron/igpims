import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as sessionQuery from "@/backend/queries/session"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  DeleteManyUserByIdPayload,
  deleteManyUserByIdSchema,
} from "@/validation/user"

export async function deleteManyUserById(
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

    const data = await requestJson<DeleteManyUserByIdPayload>(request)
    const validationResult = await deleteManyUserByIdSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const { userIds } = validationResult.data

    await db.transaction(async (_tx) => {
      const findResult = await userQuery.findManyByUserIdsQuery.execute({
        userIds,
      })

      if (!findResult.length) {
        throw new Error("No users found")
      }

      await Promise.all([
        sessionQuery.deleteByArrayUserIdsQuery.execute({ userIds }),
        accountQuery.deleteByArrayUserIdsQuery.execute({ userIds }),
        userQuery.deleteByArrayUserIds.execute({ userIds }),
      ])
    })

    return NextResponse.json({ deletedIds: userIds }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
