import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as lockerQuery from "@/backend/queries/locker"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { Locker, lockerSchema } from "@/validation/locker"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

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

    const { clusterName, lockersPerCluster } = validationResult.data
    const clusterId = nanoid(15)

    if (
      typeof lockersPerCluster !== "number" ||
      Number.isNaN(lockersPerCluster)
    ) {
      return NextResponse.json(
        { error: "lockersPerCluster is required and must be a number" },
        { status: 400 },
      )
    }

    const createdLockers = await db.transaction(async (_tx) => {
      const lockers = []
      let currentIndex = 1
      let createdCount = 0

      while (createdCount < lockersPerCluster) {
        const generatedLockerName = `${clusterName}-${currentIndex}`

        const existingLocker = await lockerQuery.getLockerByNameQuery.execute({
          name: generatedLockerName,
        })

        if (!existingLocker[0]) {
          const lockerId = nanoid(15)

          await lockerQuery.createLockerQuery.execute({
            id: lockerId,
            lockerStatus: validationResult.data.lockerStatus || "available",
            lockerType: validationResult.data.lockerType || "small",
            lockerName: generatedLockerName,
            lockerLocation: validationResult.data.lockerLocation,
            lockerRentalPrice: validationResult.data.lockerRentalPrice || 0,
            clusterName: clusterName,
            clusterId: clusterId,
          })

          const result = await lockerQuery.getLockerByIdQuery.execute({
            id: lockerId,
          })

          if (!result || !result[0]) {
            throw new Error(`Failed to create locker ${generatedLockerName}`)
          }

          lockers.push(result[0])
          createdCount++
        }

        currentIndex++

        if (currentIndex > lockersPerCluster + 1000) {
          throw new Error(
            `Unable to generate ${lockersPerCluster} unique locker names for cluster ${clusterName}. Too many existing lockers.`,
          )
        }
      }

      return lockers
    })

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has created ${createdLockers.length} lockers in cluster: ${clusterName}`,
    })

    return NextResponse.json(createdLockers, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
