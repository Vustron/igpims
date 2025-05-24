import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import * as lockerQuery from "@/backend/queries/locker"
import { requestJson } from "@/utils/request-json"
import { locker } from "@/schemas/drizzle-schema"
import { catchError } from "@/utils/catch-error"
import { lockerSchema } from "@/schemas/locker"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"
import { eq, sql } from "drizzle-orm"

import type { Locker } from "@/schemas/locker"
import type { NextRequest } from "next/server"

export async function updateLocker(
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
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Locker ID is required" },
        { status: 400 },
      )
    }

    const existingLocker = await db.transaction(async (_tx) => {
      const result = await lockerQuery.getLockerByIdQuery.execute({
        id,
      })
      return result[0]
    })

    if (!existingLocker) {
      return NextResponse.json({ error: "Locker not found" }, { status: 404 })
    }

    const data = await requestJson<Locker>(request)
    const validationResult = await lockerSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    if (
      validationResult.data.lockerName &&
      validationResult.data.lockerName !== existingLocker.lockerName
    ) {
      const duplicateLocker = await db.transaction(async (_tx) => {
        const result = await lockerQuery.getLockerByNameQuery.execute({
          name: validationResult.data.lockerName,
        })
        return result[0]
      })

      if (duplicateLocker) {
        return NextResponse.json(
          { error: "A locker with this name already exists" },
          { status: 409 },
        )
      }
    }

    const updatedLocker = await db.transaction(async (_tx) => {
      const result = await db
        .update(locker)
        .set({
          lockerStatus:
            validationResult.data.lockerStatus || existingLocker.lockerStatus,
          lockerType:
            validationResult.data.lockerType || existingLocker.lockerType,
          lockerName:
            validationResult.data.lockerName || existingLocker.lockerName,
          lockerLocation:
            validationResult.data.lockerLocation ||
            existingLocker.lockerLocation,
          lockerRentalPrice:
            validationResult.data.lockerRentalPrice ??
            existingLocker.lockerRentalPrice,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(locker.id, id))
        .returning()
        .execute()

      return result[0]
    })

    if (!updatedLocker) {
      return NextResponse.json(
        { error: "Failed to update locker" },
        { status: 500 },
      )
    }

    return NextResponse.json(updatedLocker, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: catchError(error) || "Failed to update locker" },
      { status: 500 },
    )
  }
}
