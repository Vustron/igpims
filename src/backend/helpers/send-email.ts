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
    | "payment-overdue"
}

export async function sendLockerEmail(params: EmailParams) {
  try {
    console.log("sendLockerEmail called with params:", params)

    if (!params.renterEmail || !params.subject) {
      console.error("Missing required email parameters")
      throw new Error("Missing required email parameters")
    }

    console.log("Rendering email template...")
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
    console.log("Email template rendered.")

    const mailOptions = {
      from: `IGPIMS ${env.EMAIL}`,
      to: params.renterEmail,
      subject: params.subject,
      html: emailHtml,
    }

    if (!transporter) {
      console.error("Email transporter not configured")
      throw new Error("Email transporter not configured")
    }

    if (!env.EMAIL) {
      console.error("Sender email not configured in environment variables")
      throw new Error("Sender email not configured in environment variables")
    }

    console.log("Sending email with options:", mailOptions)
    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully.")

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }
  }
}
