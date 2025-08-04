import { fundRequest } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { createNotification } from "@/backend/helpers/create-notification"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import {
  findFundRequestByIdQuery,
  insertFundRequestQuery,
} from "@/backend/queries/fund-request"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateFundRequest,
  createFundRequestSchema,
} from "@/validation/fund-request"
import { eq } from "drizzle-orm"
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
      .select({
        purpose: fundRequest.purpose,
      })
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
        currentStep: 1,
        requestDate: fundRequestData.requestDate,
        dateNeeded: fundRequestData.dateNeeded,
        requestor: fundRequestData.requestor,
        requestorPosition: fundRequestData.position,
        isRejected: false,
        rejectionStep: 0,
      })
    })

    const [updatedRequest] = await findFundRequestByIdQuery.execute({
      id: fundRequestId,
    })

    await Promise.all([
      createNotification({
        id: nanoid(15),
        type: "fund_request",
        requestId: updatedRequest?.id!,
        title: `New Fund Request Created: ${updatedRequest?.purpose}`,
        description: `A new Fund Request "${updatedRequest?.purpose}" has been created by ${currentSession.userName} and is pending review.`,
        action: "created",
        actorId: currentSession.userId,
        details: "A new fund request",
      }),
      activityLogger({
        userId: currentSession.userId,
        action: `${currentSession.userName} has created a fund request: ${updatedRequest?.purpose}`,
      }),
    ])

    return NextResponse.json(updatedRequest, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
