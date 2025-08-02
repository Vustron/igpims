import { fundRequest } from "@/backend/db/schemas"
import { createNotification } from "@/backend/helpers/create-notification"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function deleteFundRequest(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get("id")

    if (!requestId) {
      return NextResponse.json(
        { error: "Fund Request ID is required" },
        { status: 400 },
      )
    }

    const deleteFundRequest = await db.transaction(async (tx) => {
      const fundRequestResult = await tx.query.fundRequest.findFirst({
        where: eq(fundRequest.id, requestId),
      })

      if (!fundRequestResult) {
        throw new Error("Fund Request not found")
      }

      await tx.delete(fundRequest).where(eq(fundRequest.id, requestId))
      return fundRequestResult
    })

    await createNotification({
      id: nanoid(15),
      type: "fund_request",
      requestId: deleteFundRequest?.id!,
      title: `Fund Request Deleted: ${deleteFundRequest?.purpose}`,
      description: `Fund Request "${deleteFundRequest?.purpose}" has been deleted by ${currentSession.userName}.`,
      action: "rejected",
      actorId: currentSession.userId,
      details: "The fund request have been deleted",
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
