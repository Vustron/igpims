import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { updateInspectionQuery } from "@/backend/queries/inspection"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { Inspection, InspectionSchema } from "@/validation/inspection"

export async function updateInspection(
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

    const data = await requestJson<Inspection>(request)
    const validationResult = await InspectionSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const inspectionData = validationResult.data
    const { ...updateData } = inspectionData

    if (!id) {
      return NextResponse.json(
        { error: "Inspection ID is required" },
        { status: 400 },
      )
    }

    const formattedViolators = Array.isArray(updateData.violators)
      ? JSON.stringify(updateData.violators)
      : updateData.violators

    const result = await updateInspectionQuery.execute({
      id,
      dateOfInspection: updateData.dateOfInspection,
      dateSet: updateData.dateSet,
      violators: formattedViolators,
      totalFines: updateData.totalFines,
    })

    if (!result.length) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(validationResult.data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
