import { Account, User } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import {
  CompatibleRequest,
  httpRequestLimit,
} from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as sessionQuery from "@/backend/queries/session"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { getSession } from "@/config/session"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  SignInOtpAuthenticatorPayload,
  signInOtpAuthenticatorSchema,
} from "@/validation/user"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "request-ip"
import speakeasy from "speakeasy"

export async function signInOtpAuth(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const data = await requestJson<SignInOtpAuthenticatorPayload>(request)
    const validationResult =
      await signInOtpAuthenticatorSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    if (!validationResult.data.otp || !validationResult.data.userId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 401 },
      )
    }

    const { otp, userId } = validationResult.data
    let userData: User | undefined
    let accountData: Account | undefined

    await db.transaction(async (_tx) => {
      const [userResult, accountResult] = await Promise.all([
        userQuery.findByUserIdQuery.execute({ userId }),
        accountQuery.findByAccountUserIdQuery.execute({
          accountUserId: userId,
        }),
      ])

      userData = userResult[0] as User
      accountData = accountResult[0] as Account

      if (!userData || !accountData) {
        throw new Error("User not found")
      }

      if (!accountData.twoFactorSecret) {
        throw new Error("2FA not setup")
      }

      const verified = speakeasy.totp.verify({
        secret: accountData.twoFactorSecret,
        encoding: "base32",
        token: otp,
        window: 1,
      })

      if (!verified) {
        throw new Error("Invalid authentication code")
      }

      if (userData.role === "student") {
        return NextResponse.json(
          {
            error:
              "Student is not allowed to login.Please contact the SSC for further information.",
          },
          { status: 404 },
        )
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

      await Promise.all([
        sessionQuery.insertSessionQuery.execute({
          id: sessionId,
          userId: userData.id,
          token: sessionToken,
          expiresAt: new Date(expiresAt),
          ipAddress: clientIp,
          userAgent: request.headers.get("user-agent") ?? "",
          userRole: userData.role,
          userName: userData.name,
        }),
        accountQuery.updateAccountSessionQuery.execute({
          userId: userData.id,
          accessToken: sessionToken,
          accessTokenExpiresAt: new Date(expiresAt),
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

    await activityLogger({
      userId: userData.id,
      action: `${userData.name} has signed in using otp`,
    })

    return NextResponse.json(
      { otpSignIn: accountData.otpSignIn },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
