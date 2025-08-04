import { fundRequest } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { createNotification } from "@/backend/helpers/create-notification"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findFundRequestByIdQuery } from "@/backend/queries/fund-request"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateFundRequest,
  updateFundRequestSchema,
} from "@/validation/fund-request"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function updateFundRequest(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Fund Request ID is required" },
        { status: 400 },
      )
    }

    const data = await requestJson<Partial<UpdateFundRequest>>(request)
    const validationResult = await updateFundRequestSchema
      .partial()
      .safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const updateData = validationResult.data

    await db.transaction(async (_tx) => {
      const existingRequest = await db
        .select()
        .from(fundRequest)
        .where(eq(fundRequest.id, id))
        .limit(1)

      if (!existingRequest.length) {
        throw new Error("Fund Request not found")
      }

      const updateValues: Partial<typeof fundRequest.$inferInsert> = {}

      if (updateData.status !== undefined) {
        updateValues.status = updateData.status

        if (updateData.status === "rejected" && updateData.rejectionReason) {
          updateValues.isRejected = true
          updateValues.rejectionReason = updateData.rejectionReason
          updateValues.rejectionStep =
            updateData.currentStep ?? existingRequest[0]?.currentStep ?? 1
        }
      }

      const handleDateField = (
        dateValue: string | number | Date | undefined,
      ) => {
        if (!dateValue) return undefined
        if (typeof dateValue === "string") return new Date(dateValue)
        if (typeof dateValue === "number") return new Date(dateValue)
        return dateValue
      }

      if (updateData.purpose !== undefined)
        updateValues.purpose = updateData.purpose
      if (updateData.amount !== undefined)
        updateValues.amount = updateData.amount
      if (updateData.utilizedFunds !== undefined)
        updateValues.utilizedFunds = updateData.utilizedFunds
      if (updateData.allocatedFunds !== undefined)
        updateValues.allocatedFunds = updateData.allocatedFunds
      if (updateData.currentStep !== undefined)
        updateValues.currentStep = updateData.currentStep
      if (updateData.requestorPosition !== undefined)
        updateValues.requestorPosition = updateData.requestorPosition
      if (updateData.dateNeeded !== undefined)
        updateValues.dateNeeded = handleDateField(updateData.dateNeeded)
      if (updateData.rejectionReason !== undefined)
        updateValues.rejectionReason = updateData.rejectionReason
      if (updateData.rejectionStep !== undefined)
        updateValues.rejectionStep = updateData.rejectionStep
      if (updateData.notes !== undefined) updateValues.notes = updateData.notes
      if (updateData.reviewerComments !== undefined)
        updateValues.reviewerComments = updateData.reviewerComments
      if (updateData.receipts !== undefined)
        updateValues.receipts = updateData.receipts
      if (updateData.status === "approved")
        updateValues.approvedBy = currentSession.userId
      if (updateData.disbursementDate !== undefined)
        updateValues.disbursementDate = handleDateField(
          updateData.disbursementDate,
        )
      if (updateData.receiptDate !== undefined)
        updateValues.receiptDate = handleDateField(updateData.receiptDate)
      if (updateData.validationDate !== undefined)
        updateValues.validationDate = handleDateField(updateData.validationDate)
      if (updateData.digitalSignature !== undefined)
        updateValues.digitalSignature = updateData.digitalSignature
      if (updateData.auditCertification !== undefined)
        updateValues.auditCertification = updateData.auditCertification

      if (Object.keys(updateValues).length > 0) {
        await db
          .update(fundRequest)
          .set({
            ...updateValues,
            updatedAt: new Date(),
          })
          .where(eq(fundRequest.id, id))
      }
    })

    const fundRequestData = await db.transaction(async (_tx) => {
      const requestResult = await findFundRequestByIdQuery.execute({
        id: id,
      })

      return requestResult[0] || null
    })

    if (!fundRequestData) {
      return NextResponse.json(
        { error: "Fund Request not found" },
        { status: 404 },
      )
    }

    await Promise.all([
      createNotification({
        id: nanoid(15),
        type: "fund_request",
        requestId: fundRequestData?.id!,
        title: `Fund Request Updated: ${fundRequestData?.purpose}`,
        description: `Fund Request "${fundRequestData?.purpose}" status has been updated by ${currentSession.userName}.`,
        action: "updated",
        actorId: currentSession.userId,
        details: "The fund request have been updated",
      }),
      activityLogger({
        userId: currentSession.userId,
        action: `${currentSession.userName} has updated a fund request:${fundRequestData.purpose}`,
      }),
    ])

    return NextResponse.json(fundRequestData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
