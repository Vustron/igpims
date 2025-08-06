import { User } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { UpdateUserPayload, updateUserSchema } from "@/validation/user"
import { compare, genSalt, hash } from "bcrypt-ts"
import { NextRequest, NextResponse } from "next/server"

export async function updateUserInfo(
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
        { status: 400 },
      )
    }

    const data = await requestJson<UpdateUserPayload>(request)
    const validationResult = await updateUserSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    let userData: User | undefined

    await db.transaction(async (_tx) => {
      const [userResult] = await Promise.all([
        userQuery.findByUserIdQuery.execute({
          userId,
        }),
        accountQuery.findByAccountUserIdQuery.execute({
          accountUserId: userId,
        }),
      ])

      userData = userResult[0] as User

      if (!userData) {
        throw new Error("User not found")
      }

      if (validationResult.data.otpSignIn !== undefined) {
        if (!validationResult.data.otpSignIn) {
          await Promise.all([
            accountQuery.updateAccountOtpSignInQuery.execute({
              userId: userId,
              otpSignIn: false,
            }),
            accountQuery.emptyAccountTwoFactorSecretQuery.execute({
              userId: userId,
              twoFactorSecret: null,
            }),
          ])
        } else {
          await accountQuery.updateAccountOtpSignInQuery.execute({
            userId: userId,
            otpSignIn: true,
          })
        }
      }

      if (
        validationResult.data.name ||
        validationResult.data.email ||
        validationResult.data.image !== undefined ||
        validationResult.data.emailVerified !== undefined
      ) {
        const imageValue =
          !validationResult.data.image || validationResult.data.image === ""
            ? null
            : validationResult.data.image

        const isEmailChanged =
          validationResult.data.email &&
          validationResult.data.email !== userData.email

        await userQuery.updateUserQuery.execute({
          id: userId,
          name: validationResult.data.name || userData.name,
          email: validationResult.data.email || userData.email,
          image: imageValue,
          emailVerified:
            validationResult.data.emailVerified !== undefined
              ? validationResult.data.emailVerified
              : isEmailChanged
                ? false
                : userData.emailVerified,
          updatedAt: new Date(),
        })
      }

      if (validationResult.data.newPassword) {
        if (!validationResult.data.currentPassword) {
          throw new Error("Current password is required")
        }

        const accountResult =
          await accountQuery.findByAccountUserIdQuery.execute({
            accountUserId: userId,
          })
        const userAccount = accountResult[0]

        if (!userAccount?.password) {
          throw new Error("Account not found")
        }

        const pepper = env.SECRET_KEY
        const currentPepperPassword =
          validationResult.data.currentPassword + pepper

        const isCurrentPasswordValid = await compare(
          currentPepperPassword,
          userAccount.password,
        )

        if (!isCurrentPasswordValid) {
          throw new Error("Current password is incorrect")
        }

        const salt = await genSalt(10)
        const newPepperPassword = validationResult.data.newPassword + pepper
        const hashedPassword = await hash(newPepperPassword, salt)

        await accountQuery.updateAccountPasswordQuery.execute({
          userId: userId,
          password: hashedPassword,
          salt: salt,
          updatedAt: new Date(),
        })
      }

      const updateResult = await userQuery.findByUserIdQuery.execute({
        userId: userId,
      })
      userData = updateResult[0] as User
    })

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await activityLogger({
      userId: userData.id,
      action: `${userData.name} has updated user info`,
    })

    return NextResponse.json(userData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
