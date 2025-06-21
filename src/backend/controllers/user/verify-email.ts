import { NextRequest, NextResponse } from "next/server"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as tokenQuery from "@/backend/queries/token"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { emailVerificationSchema, VerifyEmailPayload } from "@/validation/user"

export async function verifyUserEmail(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const data = await requestJson<VerifyEmailPayload>(request)
    const validationResult = await emailVerificationSchema.safeParseAsync(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    let success = false

    await db.transaction(async (_tx) => {
      const tokens = await tokenQuery.findVerifyEmailTokenQuery.execute({
        token: validationResult.data.token,
        email: validationResult.data.email,
        now: new Date(),
      })

      const token = tokens[0]
      if (!token) throw new Error("Invalid or expired verification token")

      await Promise.all([
        userQuery.verifyUserEmailQuery.execute({
          emailVerified: true,
          updatedAt: new Date(),
          userId: token.userId,
        }),
        tokenQuery.deleteVerifyEmailTokenQuery.execute({
          token: validationResult.data.token,
        }),
      ])

      success = true
    })

    if (success) {
      return NextResponse.json("Email verified successfully", { status: 201 })
    }

    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 400 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
