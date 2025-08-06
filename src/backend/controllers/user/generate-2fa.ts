import { Account, User } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { getSession } from "@/config/session"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"
import speakeasy from "speakeasy"

export async function generate2fa(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const currentSession = await getSession()
    if (!currentSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let userData: User | undefined
    let accountData: Account | undefined
    let existingSecret: string | null = null

    await db.transaction(async (_tx) => {
      const [userResult, accountResult] = await Promise.all([
        userQuery.findByUserIdQuery.execute({
          userId: currentSession.userId,
        }),
        accountQuery.findByAccountUserIdQuery.execute({
          accountUserId: currentSession.userId,
        }),
      ])

      userData = userResult[0] as User
      accountData = accountResult[0] as Account

      if (!userData || !accountData) {
        throw new Error("User not found")
      }

      existingSecret = accountResult[0]?.twoFactorSecret || null
    })

    if (existingSecret) {
      const existingQR = await QRCode.toDataURL(
        `otpauth://totp/${env.TWO_FACTOR_SECRET}:${currentSession.userId}?secret=${existingSecret}`,
      )
      return NextResponse.json(existingQR, { status: 200 })
    }

    const secret = speakeasy.generateSecret({
      name: `${env.TWO_FACTOR_SECRET}:${currentSession.userId}`,
      length: 20,
    })

    await Promise.all([
      accountQuery.updateAccountTwoFactorSecretQuery.execute({
        userId: currentSession.userId,
        twoFactorSecret: secret.base32,
      }),
      activityLogger({
        userId: currentSession.userId,
        action: `${currentSession.userName} has generated a two factor auth`,
      }),
    ])

    const data = await QRCode.toDataURL(secret.otpauth_url as string)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
