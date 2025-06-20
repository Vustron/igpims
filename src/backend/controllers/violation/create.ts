import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { type Violation, ViolationSchema } from "@/validation/violation"
import { insertViolationQuery } from "@/backend/queries/violation"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { requestJson } from "@/utils/request-json"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"

import type { NextRequest } from "next/server"

export async function createViolation(
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

    const data = await requestJson<Violation>(request)

    const validationResult = await ViolationSchema.omit({
      id: true,
    }).safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const {
      studentId,
      studentName,
      violations,
      violationType,
      dateOfInspection,
      dateReported,
      totalFine,
      amountPaid,
      fineStatus,
      lockerId,
      description,
      reportedBy,
      evidence,
      resolutionNotes,
    } = validationResult.data

    const result = await db.transaction(async (_tx) => {
      const insertedViolation = await insertViolationQuery.execute({
        studentId,
        studentName,
        violations,
        violationType,
        dateOfInspection,
        dateReported,
        totalFine,
        amountPaid: amountPaid || 0,
        fineStatus,
        lockerId,
        description: description || null,
        reportedBy,
        evidence: evidence || [],
        resolutionNotes: resolutionNotes || null,
      })

      return insertedViolation[0]
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
