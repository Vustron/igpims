import { NextRequest, NextResponse } from "next/server"
import { Account, User } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"

export async function findUserById(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) {
      return currentSession
    }

    const url = new URL(request.url)
    const userId = url.searchParams.get("id")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 },
      )
    }

    let userData: User | undefined
    let accountData: Account | undefined

    await db.transaction(async (_tx) => {
      const [userResult, accountResult] = await Promise.all([
        userQuery.findByUserIdQuery.execute({
          userId,
        }),
        accountQuery.findByAccountUserIdQuery.execute({
          accountUserId: userId,
        }),
      ])

      userData = userResult[0] as User
      accountData = accountResult[0] as Account
    })

    if (!userData || !accountData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json(
      {
        ...userData,
        otpSignIn: accountData.otpSignIn,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
