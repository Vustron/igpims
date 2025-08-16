import { render } from "@react-email/components"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { locker, lockerRental } from "@/backend/db/schemas"
import { EmailTemplate } from "@/components/ui/email"
import { db } from "@/config/drizzle"
import { env } from "@/config/env"
import { transporter } from "@/config/nodemailer"
import { catchError } from "@/utils/catch-error"

export async function checkPaymentStatusCronJob(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const SECRET_KEY = env.SECRET_KEY
    const authHeader = request.headers.get("authorization")
    const ACTION_KEY = authHeader ? authHeader.split(" ")[1] : ""

    if (ACTION_KEY !== SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pendingRentals = await db
      .select()
      .from(lockerRental)
      .where(eq(lockerRental.paymentStatus, "pending"))

    const allLockers = await db.select().from(locker)

    const emailPromises = pendingRentals.map(async (rental) => {
      const lockerDetails = allLockers.find((l) => l.id === rental.lockerId)

      const emailContent = await render(
        EmailTemplate({
          recipientName: rental.renterName,
          lockerDetails: {
            name: `Locker ID: ${rental.lockerId}`,
            location:
              lockerDetails?.lockerLocation || "Check with administration",
          },
          type: "payment-reminder",
          dueDate: rental.dateDue,
          amount: lockerDetails?.lockerRentalPrice || 0,
          email: rental.renterEmail,
        }),
      )

      const mailOptions = {
        from: `IGPISMS ${env.EMAIL}`,
        to: rental.renterEmail,
        subject: "Payment Reminder: Locker Rental Payment Due",
        html: emailContent,
      }

      return transporter.sendMail(mailOptions)
    })

    await Promise.all(emailPromises)

    return NextResponse.json(
      {
        message: `Successfully checked payment status`,
        pendingCount: pendingRentals.length,
        emailsSent: emailPromises.length,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
