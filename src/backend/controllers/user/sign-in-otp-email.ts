import { Account, OtpToken, User } from "@/backend/db/schemas"
import { CompatibleRequest } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as sessionQuery from "@/backend/queries/session"
import * as tokenQuery from "@/backend/queries/token"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { getSession } from "@/config/session"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { SignInOtpEmailPayload, signInOtpEmailSchema } from "@/validation/user"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "request-ip"

export async function signInOtpEmail(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const data = await requestJson<SignInOtpEmailPayload>(request)
    const validationResult = await signInOtpEmailSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 401 },
      )
    }

    let userData: User | undefined
    let accountData: Account | undefined
    let otpData: OtpToken | undefined

    await db.transaction(async (_tx) => {
      const otpResult = await tokenQuery.findOtpTokenQuery.execute({
        otp: validationResult.data.otp,
      })
      otpData = otpResult[0] as OtpToken

      if (!otpData) {
        throw new Error("Invalid OTP")
      }

      const sessionToken = nanoid()
      const timestamp = Date.now()
      const expiresAt = timestamp + 24 * 60 * 60 * 1000
      const sessionId = nanoid()

      const compatibleRequest: CompatibleRequest = {
        headers: Object.fromEntries(request.headers.entries()),
        url: request.url || "",
        method: request.method || "GET",
      } as CompatibleRequest
      const clientIp = getClientIp(compatibleRequest) || "unknown"

      const userResult = await userQuery.findByUserIdQuery.execute({
        userId: otpData.userId,
      })
      userData = userResult[0] as User

      const accountResult = await accountQuery.findByAccountUserIdQuery.execute(
        {
          accountUserId: otpData.userId,
        },
      )
      accountData = accountResult[0] as Account

      if (userData.role === "student") {
        return NextResponse.json(
          {
            error:
              "Student is not allowed to login.Please contact the SSC for further information.",
          },
          { status: 404 },
        )
      }

      await Promise.all([
        sessionQuery.insertSessionQuery.execute({
          id: sessionId,
          userId: otpData.userId,
          token: sessionToken,
          expiresAt: new Date(expiresAt),
          ipAddress: clientIp,
          userAgent: request.headers.get("user-agent") ?? "",
          userRole: userData.role,
          userName: userData.name,
        }),
        accountQuery.updateAccountSessionQuery.execute({
          userId: otpData.userId,
          accessToken: sessionToken,
          accessTokenExpiresAt: new Date(expiresAt),
          updatedAt: new Date(timestamp),
        }),
        tokenQuery.deleteOtpTokenQuery.execute({
          email: otpData.email,
          userId: otpData.userId,
        }),
      ])

      const currentSession = await getSession()
      Object.assign(currentSession, {
        id: sessionId,
        userId: userData.id,
        token: sessionToken,
        expiresAt: new Date(expiresAt),
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
        ipAddress: clientIp,
        userAgent: request.headers.get("user-agent") ?? "",
        userRole: userData.role,
        userName: userData.name,
      })

      await currentSession.save()
    })

    if (!userData || !accountData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      { otpSignIn: accountData?.otpSignIn },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
