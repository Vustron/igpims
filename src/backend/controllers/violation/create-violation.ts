import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as violationQuery from "@/backend/queries/violation"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { Violation, ViolationSchema } from "@/validation/violation"

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

    const data = await requestJson<Omit<Violation, "id">>(request)
    const validationResult = await ViolationSchema.omit({
      id: true,
    }).safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const violationData = validationResult.data

    const dateOfInspectionTimestamp =
      typeof violationData.dateOfInspection === "string"
        ? new Date(violationData.dateOfInspection).getTime()
        : violationData.dateOfInspection

    const datePaidTimestamp = violationData.datePaid
      ? typeof violationData.datePaid === "string"
        ? new Date(violationData.datePaid).getTime()
        : violationData.datePaid
      : null

    const newViolation = await db.transaction(async (_tx) => {
      const violationId = nanoid()
      const now = Date.now()

      await violationQuery.insertViolationQuery.execute({
        id: violationId,
        lockerId: violationData.lockerId,
        inspectionId: violationData.inspectionId,
        studentName: violationData.studentName,
        violations: JSON.stringify(violationData.violations),
        dateOfInspection: dateOfInspectionTimestamp,
        datePaid: datePaidTimestamp,
        totalFine: violationData.totalFine,
        fineStatus: violationData.fineStatus || "unpaid",
      })

      return {
        id: violationId,
        lockerId: violationData.lockerId,
        inspectionId: violationData.inspectionId,
        studentName: violationData.studentName,
        violations: violationData.violations,
        dateOfInspection: dateOfInspectionTimestamp,
        datePaid: datePaidTimestamp || null,
        totalFine: violationData.totalFine,
        fineStatus: violationData.fineStatus || "unpaid",
        createdAt: now,
        updatedAt: now,
      }
    })

    return NextResponse.json(newViolation, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
