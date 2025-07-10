import { fundRequest } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { insertFundRequestQuery } from "@/backend/queries/fund-request"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateFundRequest,
  createFundRequestSchema,
} from "@/validation/fund-request"
import { eq, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function createFundRequest(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<Omit<CreateFundRequest, "id">>(request)
    const validationResult = await createFundRequestSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const fundRequestData = validationResult.data

    const existingRequest = await db
      .select()
      .from(fundRequest)
      .where(eq(fundRequest.purpose, fundRequestData.purpose))
      .limit(1)

    if (existingRequest.length > 0) {
      return NextResponse.json(
        { error: "Fund request with this purpose already exists" },
        { status: 409 },
      )
    }

    const fundRequestId = nanoid(15)
    await db.transaction(async (_tx) => {
      await insertFundRequestQuery.execute({
        id: fundRequestId,
        purpose: fundRequestData.purpose,
        amount: fundRequestData.amount,
        status: "pending",
        requestedBy: fundRequestData.requestorName,
        requestorPosition: fundRequestData.position,
        requestDate: fundRequestData.requestDate,
        dateNeeded: fundRequestData.dateNeeded,
      })
    })

    const [updatedRequest] = await db
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
      .where(eq(fundRequest.id, fundRequestId))
      .limit(1)

    return NextResponse.json(updatedRequest, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
