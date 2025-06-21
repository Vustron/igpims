import { render } from "@react-email/components"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { EmailTemplate } from "@/components/ui/email/email-template"
import { User } from "@/backend/db/schemas"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import * as tokenQuery from "@/backend/queries/token"
import * as userQuery from "@/backend/queries/user"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { transporter } from "@/config/nodemailer"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { SendEmailPayload, sendEmailSchema } from "@/validation/user"

export async function sendResetLink(
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
    let resetPasswordToken: string

    await db.transaction(async (_tx) => {
      const result = await userQuery.findByEmailQuery.execute({
        email: validationResult.data.email,
      })
      existingUser = result[0] as User

      if (!existingUser) {
        throw new Error("User does not exist")
      }

      resetPasswordToken = nanoid()
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 24)
      const now = new Date()

      await tokenQuery.insertResetTokenQuery.execute({
        id: nanoid(),
        token: resetPasswordToken,
        email: validationResult.data.email,
        expires: expiryDate,
        createdAt: now,
        updatedAt: now,
        userId: existingUser.id,
      })
    })

    const resetPasswordEmail = await render(
      EmailTemplate({
        token: resetPasswordToken!,
        email: validationResult.data.email,
        type: "reset-password",
      }),
    )

    const mailOptions = {
      from: `Vustron-Chan ${env.EMAIL}`,
      to: validationResult.data.email,
      subject: "Password Reset",
      html: resetPasswordEmail,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json("Reset password link sent", { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
