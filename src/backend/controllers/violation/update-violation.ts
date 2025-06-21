import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import {
  findViolationByIdQuery,
  updateViolationQuery,
} from "@/backend/queries/violation"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { type Violation, ViolationSchema } from "@/validation/violation"

export async function updateViolation(
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
    const userId = url.searchParams.get("id")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      )
    }

    const data = await requestJson<Violation>(request)
    const validationResult = await ViolationSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }
    const { id, ...updateData } = validationResult.data

    if (!id) {
      return NextResponse.json(
        { error: "Violation ID is required" },
        { status: 400 },
      )
    }

    const result = await db.transaction(async (_tx) => {
      const existingViolation = await findViolationByIdQuery.execute({ id })

      if (!existingViolation.length) {
        return NextResponse.json(
          { error: "Violation not found" },
          { status: 404 },
        )
      }

      const result = await updateViolationQuery.execute({
        id,
        ...updateData,
      })

      return NextResponse.json(result[0])
    })

    return result
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
