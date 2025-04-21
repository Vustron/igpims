import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as userQuery from "@/backend/queries/user"
import { catchError } from "@/utils/catch-error"
import { getSession } from "@/config/session"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

import type { Account, User } from "@/schemas/drizzle-schema"
import type { NextRequest } from "next/server"

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

    await accountQuery.updateAccountTwoFactorSecretQuery.execute({
      userId: currentSession.userId,
      twoFactorSecret: secret.base32,
      updatedAt: new Date(),
    })

    const data = await QRCode.toDataURL(secret.otpauth_url as string)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
