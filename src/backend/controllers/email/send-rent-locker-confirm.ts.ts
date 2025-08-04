import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { EmailTemplate } from "@/components/ui/email"
import { env } from "@/config/env"
import { transporter } from "@/config/nodemailer"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { lockerRentRecipientSchema } from "@/validation/email"
import { render } from "@react-email/components"
import { format } from "date-fns"
import { NextRequest, NextResponse } from "next/server"

export async function sendRentLockerConfirm(
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

    const data = await requestJson(request)
    const payloads = Array.isArray(data) ? data : [data]

    const validationResults = await Promise.all(
      payloads.map((payload) =>
        lockerRentRecipientSchema.safeParseAsync(payload),
      ),
    )

    const errors = validationResults
      .filter((result) => !result.success)
      .flatMap((result) => result.error?.issues || [])

    if (errors.length > 0) {
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const validPayloads = validationResults
      .filter((result) => result.success)
      .map((result) => result.data)

    const emailPromises = validPayloads.map(async (payload) => {
      const {
        renterEmail,
        renterName,
        lockerName,
        lockerLocation,
        notificationType,
        dueDate,
        amount,
      } = payload

      const emailContent = await render(
        EmailTemplate({
          recipientName: renterName,
          lockerDetails: {
            name: lockerName,
            location: lockerLocation,
          },
          type: notificationType!,
          dueDate: format(new Date(dueDate), "MMMM d, yyyy"),
          amount,
          email: renterEmail,
        }),
      )

      const subjectMap = {
        "rental-confirmation": "Locker Rental Confirmation",
        "rental-expiration": "Locker Rental Expiration Notice",
        "rental-cancellation": "Locker Rental Cancellation Notice",
        "payment-reminder": "Locker Rental Payment Reminder",
      }

      const mailOptions = {
        from: `IGPIMS ${env.EMAIL}`,
        to: renterEmail,
        subject: subjectMap[notificationType!],
        html: emailContent,
      }

      await activityLogger({
        userId: currentSession.userId,
        action: `${currentSession.userName} has sent ${notificationType} email`,
      })

      return transporter.sendMail(mailOptions)
    })

    await Promise.all(emailPromises)

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
