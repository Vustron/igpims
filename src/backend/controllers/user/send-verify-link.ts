import { EmailTemplate } from "@/components/ui/email/email-template"

import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as tokenQuery from "@/backend/queries/token"
import * as userQuery from "@/backend/queries/user"
import { requestJson } from "@/utils/request-json"
import { transporter } from "@/config/nodemailer"
import { sendEmailSchema } from "@/schemas/user"
import { catchError } from "@/utils/catch-error"
import { render } from "@react-email/components"
import { NextResponse } from "next/server"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { nanoid } from "nanoid"

import type { SendEmailPayload } from "@/schemas/user"
import type { User } from "@/schemas/drizzle-schema"
import type { NextRequest } from "next/server"

export async function sendVerifyLink(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const data = await requestJson<SendEmailPayload>(request)
    const validationResult = await sendEmailSchema.safeParseAsync(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    let existingUser: User | undefined
    let token: string

    await db.transaction(async (_tx) => {
      const result = await userQuery.findByEmailQuery.execute({
        email: validationResult.data.email,
      })
      existingUser = result[0] as User

      if (!existingUser) {
        throw new Error("User does not exist")
      }

      token = nanoid()
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 24)
      const now = new Date()

      await tokenQuery.insertVerificationTokenQuery.execute({
        id: nanoid(),
        token: token,
        email: validationResult.data.email,
        expires: expiryDate,
        createdAt: now,
        updatedAt: now,
        userId: existingUser.id,
      })
    })

    const verificationEmail = await render(
      EmailTemplate({
        token: token!,
        email: validationResult.data.email,
        type: "verify",
      }),
    )

    const mailOptions = {
      from: `Vustron-Chan ${env.EMAIL}`,
      to: validationResult.data.email,
      subject: "Account Verification",
      html: verificationEmail,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json("Verification email sent", { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
