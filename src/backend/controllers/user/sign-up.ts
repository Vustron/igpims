import { genSalt, hash } from "bcrypt-ts"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { User } from "@/backend/db/schemas"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { SignUpPayload, signUpSchema } from "@/validation/user"

export async function signUpUser(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const data = await requestJson<SignUpPayload>(request)
    const validationResult = await signUpSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    let existingUser: User | undefined

    await db.transaction(async (_tx) => {
      const result = await userQuery.findByEmailQuery.execute({
        email: validationResult.data.email,
      })
      existingUser = result[0] as User
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      )
    }

    const salt = await genSalt(10)
    const pepper = env.SECRET_KEY
    const pepperPassword = validationResult.data.password + pepper
    const hashedPassword = await hash(pepperPassword, salt)

    const userId = nanoid()
    const accountId = nanoid()

    let newUser: User | undefined

    await db.transaction(async (_tx) => {
      await userQuery.insertUserQuery.execute({
        userId,
        name: validationResult.data.name,
        email: validationResult.data.email,
        emailVerified: false,
        role: validationResult.data.role,
      })
      await accountQuery.insertAccountQuery.execute({
        accountId,
        accountIdValue: accountId,
        userIdFk: userId,
        providerType: validationResult.data.providerType || "credentials",
        password: hashedPassword,
        salt,
        otpSignIn: false,
      })

      const result = await userQuery.findByUserIdQuery.execute({
        userId,
      })
      newUser = result[0] as User

      if (!newUser) {
        throw new Error("Failed to create user")
      }
    })

    return NextResponse.json(newUser, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
