import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { checkAuth } from "@/backend/middlewares/check-auth"
import * as rentalQuery from "@/backend/queries/rental"
import * as lockerQuery from "@/backend/queries/locker"
import { createRentalSchema } from "@/schemas/rental"
import { requestJson } from "@/utils/request-json"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"
import { nanoid } from "nanoid"

import type { CreateRentalData } from "@/schemas/rental"
import type { NextRequest } from "next/server"

export async function createRent(
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

    const data = await requestJson<CreateRentalData>(request)
    const validationResult = await createRentalSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const rentalData = validationResult.data

    const dateRentedTimestamp =
      typeof rentalData.dateRented === "string"
        ? new Date(rentalData.dateRented).getTime()
        : rentalData.dateRented

    const dateDueTimestamp =
      typeof rentalData.dateDue === "string"
        ? new Date(rentalData.dateDue).getTime()
        : rentalData.dateDue

    if (dateDueTimestamp <= dateRentedTimestamp) {
      return NextResponse.json(
        { error: "Due date must be after rental date" },
        { status: 400 },
      )
    }

    const newRental = await db.transaction(async (_tx) => {
      const lockerResult = await lockerQuery.getLockerByIdQuery.execute({
        id: rentalData.lockerId,
      })

      const locker = lockerResult[0]
      if (!locker) {
        throw new Error("Locker not found")
      }

      if (locker.lockerStatus !== "available") {
        throw new Error(
          `Locker is currently ${locker.lockerStatus} and cannot be rented`,
        )
      }

      const existingRentalResult =
        await rentalQuery.getRentalByLockerIdQuery.execute({
          lockerId: rentalData.lockerId,
        })

      const existingRental = existingRentalResult[0]
      if (existingRental && existingRental.rentalStatus === "active") {
        throw new Error("Locker is already rented by another student")
      }

      const rentalId = nanoid()
      const now = Date.now()

      await rentalQuery.createRentalQuery.execute({
        id: rentalId,
        lockerId: rentalData.lockerId,
        renterId: rentalData.renterId,
        renterName: rentalData.renterName,
        courseAndSet: rentalData.courseAndSet,
        rentalStatus: rentalData.rentalStatus,
        renterEmail: rentalData.renterEmail,
        paymentStatus: rentalData.paymentStatus,
        dateRented: dateRentedTimestamp,
        dateDue: dateDueTimestamp,
        createdAt: now,
        updatedAt: now,
      })

      if (rentalData.rentalStatus === "active") {
        await lockerQuery.updateLockerStatusQuery.execute({
          id: rentalData.lockerId,
          status: "occupied",
        })
      }

      return {
        id: rentalId,
        lockerId: rentalData.lockerId,
        renterId: rentalData.renterId,
        renterName: rentalData.renterName,
        courseAndSet: rentalData.courseAndSet,
        renterEmail: rentalData.renterEmail,
        rentalStatus: rentalData.rentalStatus,
        paymentStatus: rentalData.paymentStatus,
        dateRented: dateRentedTimestamp,
        dateDue: dateDueTimestamp,
        createdAt: now,
        updatedAt: now,
      }
    })

    return NextResponse.json(newRental, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: catchError(error) || "Failed to create rental" },
      { status: 500 },
    )
  }
}
