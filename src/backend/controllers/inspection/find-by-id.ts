import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findInspectionByIdQuery } from "@/backend/queries/inspection"
import { catchError } from "@/utils/catch-error"

export async function findInspectionById(
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
        { error: "Inspection ID is required" },
        { status: 400 },
      )
    }

    const result = await findInspectionByIdQuery.execute({ id })

    if (!result.length) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 },
      )
    }

    const inspection = result[0]

    let violatorDetails = []
    if (inspection?.violatorDetails) {
      try {
        violatorDetails = JSON.parse(inspection.violatorDetails)
      } catch (e) {
        console.error("Error parsing violator details:", e)
      }
    }

    return NextResponse.json(
      {
        ...inspection,
        violatorDetails,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
