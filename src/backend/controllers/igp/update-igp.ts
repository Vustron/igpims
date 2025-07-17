import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findIgpByIdQuery, updateIgpQuery } from "@/backend/queries/igp"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { UpdateIgpPayload, updateIgpSchema } from "@/validation/igp"
import { NextRequest, NextResponse } from "next/server"

export async function updateIgp(
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
      return NextResponse.json({ error: "IGP ID is required" }, { status: 400 })
    }

    const data = await requestJson<Partial<UpdateIgpPayload>>(request)
    const validationResult = await updateIgpSchema
      .partial()
      .safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    await db.transaction(async (_tx) => {
      const existingIgp = await findIgpByIdQuery.execute({ id })
      if (!existingIgp.length) {
        throw new Error("IGP not found")
      }

      const updateValues = validationResult.data

      if (data.igpName !== undefined) updateValues.igpName = data.igpName
      if (data.igpDescription !== undefined)
        updateValues.igpDescription = data.igpDescription
      if (data.igpType !== undefined) updateValues.igpType = data.igpType
      if (data.iconType !== undefined) updateValues.iconType = data.iconType
      if (data.semesterAndAcademicYear !== undefined)
        updateValues.semesterAndAcademicYear = data.semesterAndAcademicYear
      if (data.totalSold !== undefined) updateValues.totalSold = data.totalSold
      if (data.igpRevenue !== undefined)
        updateValues.igpRevenue = data.igpRevenue
      if (data.igpStartDate !== undefined)
        updateValues.igpStartDate = data.igpStartDate
      if (data.igpEndDate !== undefined)
        updateValues.igpEndDate = data.igpEndDate
      if (data.itemsToSell !== undefined)
        updateValues.itemsToSell = data.itemsToSell
      if (data.assignedOfficers !== undefined)
        updateValues.assignedOfficers = JSON.stringify(data.assignedOfficers)
      if (data.costPerItem !== undefined)
        updateValues.costPerItem = data.costPerItem
      if (data.projectLead !== undefined)
        updateValues.projectLead = data.projectLead
      if (data.position !== undefined) updateValues.position = data.position
      if (data.status !== undefined) updateValues.status = data.status
      if (data.currentStep !== undefined)
        updateValues.currentStep = data.currentStep
      if (data.requestDate !== undefined)
        updateValues.requestDate = data.requestDate
      if (data.dateNeeded !== undefined)
        updateValues.dateNeeded = data.dateNeeded
      if (data.isRejected !== undefined)
        updateValues.isRejected = data.isRejected
      if (data.rejectionStep !== undefined)
        updateValues.rejectionStep = data.rejectionStep
      if (data.rejectionReason !== undefined)
        updateValues.rejectionReason = data.rejectionReason
      if (data.notes !== undefined) updateValues.notes = data.notes
      if (data.reviewerComments !== undefined)
        updateValues.reviewerComments = data.reviewerComments
      if (data.projectDocument !== undefined)
        updateValues.projectDocument = data.projectDocument
      if (data.resolutionDocument !== undefined)
        updateValues.resolutionDocument = data.resolutionDocument
      if (data.submissionDate !== undefined)
        updateValues.submissionDate = data.submissionDate
      if (data.approvalDate !== undefined)
        updateValues.approvalDate = data.approvalDate

      if (Object.keys(updateValues).length > 0) {
        await updateIgpQuery.execute({
          ...updateValues,
          id,
        })
      }
    })

    const updatedIgp = await findIgpByIdQuery.execute({ id })

    if (!updatedIgp.length) {
      return NextResponse.json(
        { error: "IGP not found after update" },
        { status: 404 },
      )
    }

    return NextResponse.json(updatedIgp[0], { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
