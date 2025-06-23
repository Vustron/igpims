import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { insertInspectionQuery } from "@/backend/queries/inspection"
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
    const inspectionId = nanoid()
    const now = Date.now()

    const formattedViolators = Array.isArray(inspectionData.violators)
      ? JSON.stringify(inspectionData.violators)
      : inspectionData.violators

    const result = await insertInspectionQuery.execute({
      id: inspectionId,
      dateOfInspection: inspectionData.dateOfInspection,
      dateSet: inspectionData.dateSet,
      violators: formattedViolators,
      totalFines: inspectionData.totalFines,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
