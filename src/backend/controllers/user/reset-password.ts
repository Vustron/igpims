import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as tokenQuery from "@/backend/queries/token"
import { resetPasswordSchema } from "@/validation/user"
import { requestJson } from "@/utils/request-json"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"
import { genSalt, hash } from "bcrypt-ts"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"

import type { ResetPasswordPayload } from "@/validation/user"
import type { NextRequest } from "next/server"

export async function resetUserPassword(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const data = await requestJson<ResetPasswordPayload>(request)
    const validationResult = await resetPasswordSchema.safeParseAsync(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    let success = false

    await db.transaction(async (_tx) => {
      const tokens = await tokenQuery.findResetPasswordTokenQuery.execute({
        token: validationResult.data.token,
      })

      const token = tokens[0]
      if (!token) throw new Error("Reset token not found")

      const now = new Date()
      const tokenExpiry = new Date(token.expires)

      if (now > tokenExpiry) {
        await tokenQuery.deleteResetPasswordTokenQuery.execute({
          token: validationResult.data.token,
        })
        throw new Error("Reset token has expired")
      }

      if (token.email !== validationResult.data.email) {
        throw new Error("Invalid reset token")
      }

      const salt = await genSalt(10)
      const pepper = env.SECRET_KEY
      const pepperedPassword = validationResult.data.newPassword + pepper
      const hashedPassword = await hash(pepperedPassword, salt)

      await Promise.all([
        accountQuery.updateAccountPasswordQuery.execute({
          password: hashedPassword,
          salt,
          updatedAt: new Date(),
          userId: token.userId,
        }),
        tokenQuery.deleteResetPasswordTokenQuery.execute({
          token: validationResult.data.token,
        }),
      ])

      success = true
    })

    if (success) {
      return NextResponse.json("Password reset successfully", { status: 201 })
    }

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 400 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
