import { fundRequest } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateFundRequest,
  updateFundRequestSchema,
} from "@/validation/fund-request"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function updateFundRequest(
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

      const updateValues: Record<string, any> = {}

      if (updateData.purpose !== undefined)
        updateValues.purpose = updateData.purpose
      if (updateData.amount !== undefined)
        updateValues.amount = updateData.amount
      if (updateData.utilizedFunds !== undefined)
        updateValues.utilizedFunds = updateData.utilizedFunds
      if (updateData.allocatedFunds !== undefined)
        updateValues.allocatedFunds = updateData.allocatedFunds
      if (updateData.status !== undefined)
        updateValues.status = updateData.status
      if (updateData.requestorPosition !== undefined)
        updateValues.requestorPosition = updateData.requestorPosition
      if (updateData.dateNeeded !== undefined)
        updateValues.dateNeeded = new Date(updateData.dateNeeded).getTime()
      if (updateData.approvedBy !== undefined)
        updateValues.approvedBy = updateData.approvedBy

      if (Object.keys(updateValues).length > 0) {
        await db
          .update(fundRequest)
          .set(updateValues)
          .where(eq(fundRequest.id, id))
      }
    })

    const updatedRequest = await db
      .select({
        id: fundRequest.id,
        purpose: fundRequest.purpose,
        amount: fundRequest.amount,
        utilizedFunds: fundRequest.utilizedFunds,
        allocatedFunds: fundRequest.allocatedFunds,
        status: fundRequest.status,
        requestedBy: fundRequest.requestedBy,
        requestorPosition: fundRequest.requestorPosition,
        requestDate: sql<number>`${fundRequest.requestDate}`,
        dateNeeded: sql<number>`${fundRequest.dateNeeded}`,
        approvedBy: fundRequest.approvedBy,
        createdAt: sql<number>`${fundRequest.createdAt}`,
        updatedAt: sql<number>`${fundRequest.updatedAt}`,
      })
      .from(fundRequest)
      .where(eq(fundRequest.id, id))
      .limit(1)

    return NextResponse.json(updatedRequest[0], { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
