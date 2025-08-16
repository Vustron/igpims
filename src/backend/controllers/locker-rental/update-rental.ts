import { NextRequest, NextResponse } from "next/server"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as lockerQuery from "@/backend/queries/locker"
import * as rentalQuery from "@/backend/queries/rental"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { CreateRentalData, createRentalSchema } from "@/validation/rental"

export async function updateRental(
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
    const rentalId = url.searchParams.get("id")

    if (!rentalId) {
      return NextResponse.json(
        { error: "Rental ID is required" },
        { status: 400 },
      )
    }

    const existingRental = await db.transaction(async (_tx) => {
      const result = await rentalQuery.getRentalByIdQuery.execute({
        id: rentalId,
      })
      return result[0]
    })

    if (!existingRental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 })
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
        : rentalData.dateRented || existingRental.dateRented

    const dateDueTimestamp =
      typeof rentalData.dateDue === "string"
        ? new Date(rentalData.dateDue).getTime()
        : rentalData.dateDue || existingRental.dateDue

    if (dateDueTimestamp <= dateRentedTimestamp) {
      return NextResponse.json(
        { error: "Due date must be after rental date" },
        { status: 400 },
      )
    }

    const updatedRental = await db.transaction(async (_tx) => {
      if (
        rentalData.lockerId &&
        rentalData.lockerId !== existingRental.lockerId
      ) {
        const newLockerResult = await lockerQuery.getLockerByIdQuery.execute({
          id: rentalData.lockerId,
        })

        const newLocker = newLockerResult[0]
        if (!newLocker) {
          throw new Error("New locker not found")
        }

        if (newLocker.lockerStatus !== "available") {
          throw new Error(
            `New locker is currently ${newLocker.lockerStatus} and cannot be rented`,
          )
        }

        const existingNewLockerRentalResult =
          await rentalQuery.getRentalByLockerIdQuery.execute({
            lockerId: rentalData.lockerId,
          })

        const existingNewLockerRental = existingNewLockerRentalResult[0]
        if (
          existingNewLockerRental &&
          existingNewLockerRental.rentalStatus === "active" &&
          existingNewLockerRental.id !== rentalId
        ) {
          throw new Error("New locker is already rented by another student")
        }

        if (existingRental.rentalStatus === "active") {
          await lockerQuery.updateLockerStatusQuery.execute({
            id: existingRental.lockerId,
            status: "available",
          })
        }

        if (
          (rentalData.rentalStatus || existingRental.rentalStatus) === "active"
        ) {
          await lockerQuery.updateLockerStatusQuery.execute({
            id: rentalData.lockerId,
            status: "occupied",
          })
        }
      }

      if (
        rentalData.rentalStatus &&
        rentalData.rentalStatus !== existingRental.rentalStatus
      ) {
        const lockerId = rentalData.lockerId || existingRental.lockerId

        if (
          rentalData.rentalStatus === "active" &&
          existingRental.rentalStatus !== "active"
        ) {
          await lockerQuery.updateLockerStatusQuery.execute({
            id: lockerId,
            status: "occupied",
          })
        } else if (
          rentalData.rentalStatus !== "active" &&
          existingRental.rentalStatus === "active"
        ) {
          await lockerQuery.updateLockerStatusQuery.execute({
            id: lockerId,
            status: "available",
          })
        }
      }

      await rentalQuery.updateRentalQuery.execute({
        id: rentalId,
        renterId: rentalData.renterId || existingRental.renterId,
        studentName: rentalData.renterName || existingRental.renterName,
        courseAndSet: rentalData.courseAndSet || existingRental.courseAndSet,
        dateRented: dateRentedTimestamp,
        dateDue: dateDueTimestamp,
        paymentStatus: rentalData.paymentStatus || existingRental.paymentStatus,
      })

      const updatedResult = await rentalQuery.getRentalByIdQuery.execute({
        id: rentalId,
      })

      if (!updatedResult[0]) {
        throw new Error("Locker not found")
      }

      return updatedResult[0]
    })

    if (!updatedRental) {
      return NextResponse.json(
        { error: "Failed to update rental" },
        { status: 500 },
      )
    }

    const locker = await lockerQuery.getLockerByIdQuery.execute({
      id: rentalData.lockerId,
    })

    const lockerData = locker[0]
    if (!lockerData) {
      return NextResponse.json({ error: "Locker not found" }, { status: 500 })
    }

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has updated a locker rent: ${updatedRental.renterName}`,
    })

    return NextResponse.json(updatedRental, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
