"use server"

import { EmailTemplate } from "@/components/ui/email"
import { env } from "@/config/env"
import { transporter } from "@/config/nodemailer"
import { render } from "@react-email/components"
import { nanoid } from "nanoid"

interface EmailParams {
  recipientName: string
  lockerDetails: {
    name: string
    location: string
  }
  renterEmail: string
  subject: string
  type:
    | "verify"
    | "reset-password"
    | "otp"
    | "rental-confirmation"
    | "rental-expiration"
    | "rental-cancellation"
    | "payment-reminder"
    | "payment-success"
}

export async function sendLockerEmail(params: EmailParams) {
  try {
    console.log("Starting email sending process...")
    console.log("Recipient:", params.renterEmail)

    if (!params.renterEmail || !params.subject) {
      throw new Error("Missing required email parameters")
    }

    const emailHtml = await render(
      EmailTemplate({
        recipientName: params.recipientName,
        lockerDetails: {
          name: params.lockerDetails.name,
          location: params.lockerDetails.location,
        },
        type: params.type,
        email: params.renterEmail,
        transactionId: `${nanoid()}`,
        paymentDate: new Date().toLocaleString(),
      }),
    )

    const mailOptions = {
      from: `IGPIMS ${env.EMAIL}`,
      to: params.renterEmail,
      subject: params.subject,
      html: emailHtml,
    }

    console.log("Mail options:", {
      ...mailOptions,
      html: "[REDACTED]",
    })

    if (!transporter) {
      throw new Error("Email transporter not configured")
    }

    if (!env.EMAIL) {
      throw new Error("Sender email not configured in environment variables")
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent", info)

    return { success: true }
  } catch (error) {
    console.error("Failed to send email", error)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }
  }
}
