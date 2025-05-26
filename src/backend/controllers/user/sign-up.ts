import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as accountQuery from "@/backend/queries/account"
import * as userQuery from "@/backend/queries/user"
import { requestJson } from "@/utils/request-json"
import { catchError } from "@/utils/catch-error"
import { signUpSchema } from "@/schemas/user"
import { NextResponse } from "next/server"
import { genSalt, hash } from "bcrypt-ts"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { nanoid } from "nanoid"

import type { User } from "@/schemas/drizzle-schema"
import type { SignUpPayload } from "@/schemas/user"
import type { NextRequest } from "next/server"

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
    const timestamp = Date.now()

    let newUser: User | undefined

    await db.transaction(async (_tx) => {
      await userQuery.insertUserQuery.execute({
        userId,
        name: validationResult.data.name,
        email: validationResult.data.email,
        emailVerified: false,
        role: validationResult.data.role,
        userCreatedAt: new Date(timestamp),
        userUpdatedAt: new Date(timestamp),
      })
      await accountQuery.insertAccountQuery.execute({
        accountId,
        accountIdValue: accountId,
        userIdFk: userId,
        providerType: validationResult.data.providerType || "credentials",
        password: hashedPassword,
        salt,
        otpSignIn: false,
        accountCreatedAt: new Date(timestamp),
        accountUpdatedAt: new Date(timestamp),
      })

      const result = await userQuery.findByUserIdQuery.execute({
        userId,
      })
      newUser = result[0] as User

      if (!newUser) {
        throw new Error("Failed to create user")
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
