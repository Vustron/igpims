import { Account, User } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { handleOTP } from "@/backend/helpers/handle-otp"
import {
  CompatibleRequest,
  httpRequestLimit,
} from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as sessionQuery from "@/backend/queries/session"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { getSession } from "@/config/session"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { SignInPayload, signInSchema } from "@/validation/user"
import { compare } from "bcrypt-ts"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "request-ip"

export async function signInUser(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const data = await requestJson<SignInPayload>(request)
    const validationResult = await signInSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    let existingUser: { user: User; accounts: Account[] } | undefined

    await db.transaction(async (_tx) => {
      const result = await userQuery.findByMatchingCredentialsQuery.execute({
        email: validationResult.data.email,
      })

      if (result.length > 0) {
        existingUser = {
          user: result[0]?.user as User,
          accounts: [result[0]?.accounts as Account],
        }
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      )
    }

    if (!existingUser.accounts[0]?.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      )
    }

    if (!existingUser.user.emailVerified) {
      return NextResponse.json(
        {
          error:
            "Account is still verifying. Please contact the Student Council President for further updates on your verification status.",
          needsVerification: true,
          userId: existingUser.user.id,
        },
        { status: 403 },
      )
    }

    if (existingUser.user.role === "student") {
      return NextResponse.json(
        {
          error:
            "Student is not allowed to login.Please contact the SSC for further information.",
        },
        { status: 404 },
      )
    }

    if (existingUser.accounts[0].otpSignIn) {
      await handleOTP(existingUser.user)
      return NextResponse.json(existingUser.accounts[0], { status: 200 })
    }

    const pepper = env.SECRET_KEY
    const pepperPassword = validationResult.data.password + pepper

    const isValidPassword = await compare(
      pepperPassword,
      existingUser.accounts[0].password,
    )

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
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

    await db.transaction(async (_tx) => {
      await Promise.all([
        sessionQuery.insertSessionQuery.execute({
          id: sessionId,
          userId: existingUser?.user.id,
          token: sessionToken,
          expiresAt: new Date(expiresAt),
          ipAddress: clientIp,
          userAgent: request.headers.get("user-agent") ?? "",
          userRole: existingUser?.user.role,
          userName: existingUser?.user.name,
        }),
        accountQuery.updateAccountSessionQuery.execute({
          userId: existingUser?.user.id,
          accessToken: sessionToken,
          accessTokenExpiresAt: new Date(expiresAt),
        }),
      ])

      const currentSession = await getSession()
      Object.assign(currentSession, {
        id: sessionId,
        userId: existingUser?.user.id,
        token: sessionToken,
        expiresAt: new Date(expiresAt),
        createdAt: new Date(timestamp),
        updatedAt: new Date(timestamp),
        ipAddress: clientIp,
        userAgent: request.headers.get("user-agent") ?? "",
        userRole: existingUser?.user.role,
        userName: existingUser?.user.name,
      })

      await currentSession.save()
    })

    await activityLogger({
      userId: existingUser.user.id,
      action: `${existingUser.user.name} has signed in`,
    })

    return NextResponse.json(
      { otpSignIn: existingUser.accounts[0].otpSignIn },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
