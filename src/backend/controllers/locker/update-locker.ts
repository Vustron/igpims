import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import * as lockerQuery from "@/backend/queries/locker"
import * as rentalQuery from "@/backend/queries/rental"
import { lockerConfigSchema } from "@/schemas/locker"
import { toTimestamp } from "@/utils/date-convert"
import { requestJson } from "@/utils/request-json"
import { locker } from "@/schemas/drizzle-schema"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"
import { eq, sql } from "drizzle-orm"

import type { LockerConfig } from "@/schemas/locker"
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

    const data = await requestJson<LockerConfig>(request)
    const validationResult = await lockerConfigSchema.safeParseAsync(data)

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

    let finalLockerStatus = existingLocker.lockerStatus

    await db.transaction(async (_tx) => {
      const updateValues: any = {
        updatedAt: sql`CURRENT_TIMESTAMP`,
      }

      if (
        validationResult.data.lockerStatus !== undefined &&
        validationResult.data.lockerStatus !== existingLocker.lockerStatus
      ) {
        updateValues.lockerStatus = validationResult.data.lockerStatus
        finalLockerStatus = validationResult.data.lockerStatus
      }

      if (
        validationResult.data.lockerType !== undefined &&
        validationResult.data.lockerType !== existingLocker.lockerType
      ) {
        updateValues.lockerType = validationResult.data.lockerType
      }

      if (
        validationResult.data.lockerName !== undefined &&
        validationResult.data.lockerName !== existingLocker.lockerName
      ) {
        updateValues.lockerName = validationResult.data.lockerName
      }

      if (
        validationResult.data.lockerLocation !== undefined &&
        validationResult.data.lockerLocation !== existingLocker.lockerLocation
      ) {
        updateValues.lockerLocation = validationResult.data.lockerLocation
      }

      if (
        validationResult.data.lockerRentalPrice !== undefined &&
        validationResult.data.lockerRentalPrice !==
          existingLocker.lockerRentalPrice
      ) {
        updateValues.lockerRentalPrice = validationResult.data.lockerRentalPrice
      }

      await db
        .update(locker)
        .set(updateValues)
        .where(eq(locker.id, id))
        .execute()

      if (validationResult.data.rentalId) {
        const existingRentalResult =
          await rentalQuery.getRentalByIdQuery.execute({
            id: validationResult.data.rentalId,
          })
        const existingRental = existingRentalResult[0]

        if (existingRental) {
          await rentalQuery.updateRentalQuery.execute({
            id: validationResult.data.rentalId,
            renterId: validationResult.data.renterId || existingRental.renterId,
            renterName:
              validationResult.data.renterName || existingRental.renterName,
            renterEmail:
              validationResult.data.renterEmail || existingRental.renterEmail,
            courseAndSet:
              validationResult.data.courseAndSet || existingRental.courseAndSet,
            rentalStatus:
              validationResult.data.rentalStatus || existingRental.rentalStatus,
            paymentStatus:
              validationResult.data.paymentStatus ||
              existingRental.paymentStatus,
            dateRented: validationResult.data.dateRented
              ? typeof validationResult.data.dateRented === "string"
                ? new Date(validationResult.data.dateRented).getTime()
                : toTimestamp(validationResult.data.dateRented)
              : existingRental.dateRented,
            dateDue: validationResult.data.dateDue
              ? typeof validationResult.data.dateDue === "string"
                ? new Date(validationResult.data.dateDue).getTime()
                : typeof validationResult.data.dateDue === "object" &&
                    Object.keys(validationResult.data.dateDue).length === 0
                  ? existingRental.dateDue
                  : toTimestamp(validationResult.data.dateDue)
              : existingRental.dateDue,
          })

          if (validationResult.data.rentalStatus) {
            let newLockerStatus = finalLockerStatus

            if (validationResult.data.rentalStatus === "active") {
              newLockerStatus = "occupied"
            } else if (
              validationResult.data.rentalStatus === "expired" ||
              validationResult.data.rentalStatus === "cancelled"
            ) {
              newLockerStatus = "available"
            }

            if (newLockerStatus !== finalLockerStatus) {
              await db
                .update(locker)
                .set({
                  lockerStatus: newLockerStatus,
                  updatedAt: sql`CURRENT_TIMESTAMP`,
                })
                .where(eq(locker.id, id))
                .execute()

              finalLockerStatus = newLockerStatus
            }
          }
        }
      }
    })

    const updatedLocker = {
      id: existingLocker.id,
      lockerStatus: finalLockerStatus,
      lockerType: validationResult.data.lockerType ?? existingLocker.lockerType,
      lockerName: validationResult.data.lockerName ?? existingLocker.lockerName,
      lockerLocation:
        validationResult.data.lockerLocation ?? existingLocker.lockerLocation,
      lockerRentalPrice:
        validationResult.data.lockerRentalPrice ??
        existingLocker.lockerRentalPrice,
      createdAt: existingLocker.createdAt,
      updatedAt: Date.now(),
    }

    return NextResponse.json(updatedLocker, { status: 200 })
  } catch (error) {
    console.error("Update locker error:", error)
    return NextResponse.json(
      { error: catchError(error) || "Failed to update locker" },
      { status: 500 },
    )
  }
}
