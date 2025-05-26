import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import * as lockerQuery from "@/backend/queries/locker"
import { requestJson } from "@/utils/request-json"
import { catchError } from "@/utils/catch-error"
import { lockerSchema } from "@/schemas/locker"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"
import { nanoid } from "nanoid"

import type { Locker } from "@/schemas/locker"
import type { NextRequest } from "next/server"

export async function createLocker(
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

    const data = await requestJson<Locker>(request)
    const validationResult = await lockerSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const lockerName = validationResult.data.lockerName
    const existingLocker = await db.transaction(async (_tx) => {
      const result = await lockerQuery.getLockerByNameQuery.execute({
        name: lockerName,
      })
      return result[ 0 ]
    })

    if (existingLocker) {
      return NextResponse.json(
        { error: "A locker with this name already exists" },
        { status: 409 },
      )
    }

    const newLocker = await db.transaction(async (_tx) => {
      const lockerId = nanoid()

      await lockerQuery.createLockerQuery.execute({
        id: lockerId,
        lockerStatus: validationResult.data.lockerStatus || "available",
        lockerType: validationResult.data.lockerType || "small",
        lockerName: validationResult.data.lockerName,
        lockerLocation: validationResult.data.lockerLocation,
        lockerRentalPrice: validationResult.data.lockerRentalPrice || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await lockerQuery.getLockerByIdQuery.execute({
        id: lockerId,
      })

      if (!result || !result[ 0 ]) {
        throw new Error("Failed to create the locker")
      }

      return result[ 0 ]
    })

    return NextResponse.json(newLocker, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: catchError(error) || "Failed to create locker" },
      { status: 500 },
    )
  }
}
