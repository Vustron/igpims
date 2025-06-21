import { render } from "@react-email/components"
import { nanoid } from "nanoid"
import { EmailTemplate } from "@/components/ui/email"
import { User } from "@/backend/db/schemas"
import * as tokenQuery from "@/backend/queries/token"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { transporter } from "@/config/nodemailer"

export async function handleOTP(user: User) {
  const otpToken = nanoid(6)
  const expiryDate = new Date()
  expiryDate.setHours(expiryDate.getHours() + 24)
  const now = new Date()

  await db.transaction(async (_tx) => {
    await tokenQuery.insertOtpTokenQuery.execute({
      id: nanoid(),
      userId: user.id,
      email: user.email,
      otp: otpToken,
      createdAt: now,
    })

    const otpEmail = await render(
      EmailTemplate({
        token: otpToken!,
        email: user.email,
        type: "otp",
      }),
    )

    const mailOptions = {
      from: `Vustron-Chan ${env.EMAIL}`,
      to: user.email,
      subject: "OTP for sign-in",
      html: otpEmail,
    }

    await transporter.sendMail(mailOptions)
  })
}
