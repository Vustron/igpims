import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as inspectionQuery from "@/backend/queries/inspection"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { Inspection, InspectionSchema } from "@/validation/inspection"

export async function createInspection(
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

    const data = await requestJson<Omit<Inspection, "id">>(request)
    const validationResult = await InspectionSchema.omit({
      id: true,
    }).safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const inspectionData = validationResult.data
    const dateOfInspectionTimestamp = inspectionData.dateOfInspection
    const dateSetTimestamp = inspectionData.dateSet

    const newInspection = await db.transaction(async (_tx) => {
      const inspectionId = nanoid()

      await inspectionQuery.insertInspectionQuery.execute({
        id: inspectionId,
        dateOfInspection: dateOfInspectionTimestamp,
        dateSet: dateSetTimestamp,
        violators: JSON.stringify(inspectionData.violators),
        totalFines: inspectionData.totalFines,
      })

      return {
        id: inspectionId,
        dateOfInspection: dateOfInspectionTimestamp,
        dateSet: dateSetTimestamp,
        violators: inspectionData.violators,
        totalFines: inspectionData.totalFines,
      }
    })

    return NextResponse.json(newInspection, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
