import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { env } from "@/config/env"

interface EmailTemplateProps {
  token?: string
  email: string
  recipientName?: string
  lockerDetails?: { name: string; location: string }
  dueDate?: string
  amount?: number
  type?:
    | "verify"
    | "reset-password"
    | "otp"
    | "rental-confirmation"
    | "rental-expiration"
    | "rental-cancellation"
    | "payment-reminder"
}

export function EmailTemplate({
  token,
  email,
  recipientName,
  lockerDetails,
  dueDate,
  amount,
  type = "verify",
}: EmailTemplateProps) {
  const encodedToken = encodeURIComponent(token!)
  const encodedEmail = encodeURIComponent(email)
  const URL = `${env.NEXT_PUBLIC_APP_URL}/${type}?token=${encodedToken}&email=${encodedEmail}`
  const logoUrl = env.NEXT_PUBLIC_LOGO_URL

  const content = {
    verify: {
      preview: "Welcome to Our Service - Confirm Your Email",
      title: "Welcome to Our Service",
      subtitle: "Please confirm your email address to get started.",
      buttonText: "Verify Email Address →",
      disclaimer:
        "If you didn't request this verification, please ignore this email or contact support.",
    },
    "reset-password": {
      preview: "Reset Your Password - Password Reset Request",
      title: "Reset Your Password",
      subtitle: "We received a request to reset your password.",
      buttonText: "Reset Password →",
      disclaimer:
        "If you didn't request this password reset, please ignore this email or contact support.",
    },
    otp: {
      preview: "Your One-Time Password (OTP)",
      title: "Your OTP Code",
      subtitle: "Use this code to complete your sign in.",
      buttonText: "Verify OTP →",
      disclaimer:
        "This OTP will expire in 5 minutes. If you didn't request this code, please ignore this email or contact support.",
    },
    "rental-confirmation": {
      preview: "Locker Rental Confirmation",
      title: "Locker Rental Confirmed",
      subtitle: `Your locker rental has been confirmed for ${lockerDetails?.name} at ${lockerDetails?.location}.`,
      buttonText: "View Rental Details →",
      disclaimer:
        "Thank you for using our locker service. Keep this email for your records.",
    },
    "rental-expiration": {
      preview: "Locker Rental Expiration Notice",
      title: "Locker Rental Expiring Soon",
      subtitle: `Your locker rental for ${lockerDetails?.name} will expire on ${dueDate}.`,
      buttonText: "Renew Now →",
      disclaimer:
        "Please ensure to clear your locker before the expiration date.",
    },
    "rental-cancellation": {
      preview: "Locker Rental Cancellation",
      title: "Locker Rental Cancelled",
      subtitle: `Your locker rental for ${lockerDetails?.name} has been cancelled.`,
      buttonText: "Contact Support →",
      disclaimer:
        "If you did not request this cancellation, please contact support immediately.",
    },
    "payment-reminder": {
      preview: "Payment Reminder for Locker Rental",
      title: "Payment Reminder",
      subtitle: `Payment of ${amount?.toLocaleString("en-US", {
        style: "currency",
        currency: "PHP",
      })} is due on ${dueDate} for locker ${lockerDetails?.name}.`,
      buttonText: "Pay Now →",
      disclaimer:
        "Please settle your payment before the due date to avoid any service interruption.",
    },
  }

  const renderLockerContent = () => {
    if (!lockerDetails) return null
    return (
      <Section className="mb-8">
        <Text className="text-center text-gray-700">
          <strong>Locker Details:</strong>
          <br />
          Name: {lockerDetails.name}
          <br />
          Location: {lockerDetails.location}
          {dueDate && (
            <>
              <br />
              Due Date: {dueDate}
            </>
          )}
          {amount && (
            <>
              <br />
              Amount:{" "}
              {amount.toLocaleString("en-US", {
                style: "currency",
                currency: "PHP",
              })}
            </>
          )}
        </Text>
      </Section>
    )
  }

  const rentalTerms =
    type === "rental-confirmation" ? (
      <Section className="mt-6 border-t pt-4 text-left">
        <Text className="mb-4 text-center font-bold text-lg">
          LOCKER RENTAL TERMS AND CONDITIONS
        </Text>

        <Text className="mt-3 font-semibold">I. General Provision</Text>
        <Text className="ml-4 text-sm">
          (a) These terms and conditions regulate the rental of lockers as
          outlined in Resolution No. 10, S 2023, and its amendment, Resolution
          No. 7, S. 2024.
        </Text>
        <Text className="ml-4 text-sm">
          (b) By renting a locker, students agree to comply with these terms and
          conditions.
        </Text>

        <Text className="mt-3 font-semibold">II. Eligibility</Text>
        <Text className="ml-4 text-sm">
          a) The lessee must be a bona fide student of Davao del Norte State
          College.
        </Text>
        <Text className="ml-4 text-sm">
          b) The student must secure a rental form to be eligible for utilizing
          the school lockers.
        </Text>
        <Text className="ml-4 text-sm">
          c) Must be aware of the existing DNSC Revised Student Handbook of 2016
          to prevent committing minor and grave offenses against college
          regulations.
        </Text>
        <Text className="ml-4 text-sm">
          d) Must be mindful of the existing No Single-Use Plastic Policy of
          Davao del Norte State College.
        </Text>

        <Text className="mt-3 font-semibold">III. Rental of Lockers</Text>
        <Text className="ml-4 text-sm">
          a) The rental fees for school lockers vary depending on size; larger
          lockers are priced at 150 pesos, while smaller lockers cost 100 pesos.
        </Text>
        <Text className="ml-4 text-sm">
          b) To rent a locker, students must obtain a rental form from the
          office of the Supreme Student Council, providing the necessary details
          for the rental.
        </Text>
        <Text className="ml-4 text-sm">
          c) Any issued locker found to be defective must be reported
          immediately to the office of the Supreme Student Council.
        </Text>
        <Text className="ml-4 text-sm">
          d) Locker renewals begin one week after the final examinations of the
          College. Students can secure renewal slips to confirm their
          eligibility for rental.
        </Text>

        <Text className="mt-3 font-semibold">IV. Proper Usage of Lockers</Text>
        <Text className="ml-4 text-sm">
          a) Locker owners are permitted to store food inside, but if food is
          left unattended and becomes spoiled, the owner will face sanctions.
        </Text>
        <Text className="ml-4 text-sm">
          b) The storage of used, damp, or wet clothes in lockers is prohibited.
        </Text>
        <Text className="ml-4 text-sm">
          c) Student must adhere to the College's No Single-Use Plastic Policy,
          which prohibits any single-use plastics from being stored in lockers.
        </Text>
        <Text className="ml-4 text-sm">
          d) Students are forbidden from storing illegal items such as firearms,
          ammunition, sharp weapons, explosives, illegal drugs, alcoholic
          substances, and any items deemed harmful or inappropriate.
        </Text>

        <Text className="mt-3 font-semibold">V. Inspection</Text>
        <Text className="ml-4 text-sm">
          a) Lockers will be inspected on a bi-monthly basis.
        </Text>
        <Text className="ml-4 text-sm">
          b) Inspections will occur during the second and fourth weeks of each
          month.
        </Text>

        <Text className="mt-3 font-semibold">VI. Fines and Conditions</Text>
        <Text className="ml-4 text-sm">
          a) Students who violate the rules will face the following penalties:
        </Text>
        <div className="ml-8 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <Text>• Scratches: PHP 5.00 per scratch</Text>
          <Text>• Dents: PHP 50.00</Text>
          <Text>• Prohibited single-use plastics: PHP 70.00</Text>
          <Text>• Lost locker keys: PHP 150.00</Text>
          <Text>• Spoiled food: PHP 100.00</Text>
          <Text>• Graffiti: PHP 200.00</Text>
          <Text>• Broken locks: PHP 300.00</Text>
          <Text>• Broken hinges: PHP 300.00</Text>
        </div>

        <Text className="mt-3 font-semibold">
          VII. Settlement of Liabilities
        </Text>
        <Text className="ml-4 text-sm">
          a) Violators will be given seven (7) working days to pay their
          penalties.
        </Text>
        <Text className="ml-4 text-sm">
          b) Failure to settle penalties will result in termination of rental
          contract.
        </Text>

        <Text className="mt-3 font-semibold">VIII. Termination</Text>
        <Text className="ml-4 text-sm">
          a) The contract is valid for one semester only.
        </Text>
        <Text className="ml-4 text-sm">
          b) Upon expiration, students must empty their lockers and return the
          key.
        </Text>
        <Text className="ml-4 text-sm">
          c) Unclaimed items will be stored at the Office of the Supreme Student
          Council.
        </Text>

        <Text className="mt-3 font-semibold">IX. Dispute Resolution</Text>
        <Text className="ml-4 text-sm">
          a) The Office is not responsible for lost property.
        </Text>
        <Text className="ml-4 text-sm">
          b) Incidents of theft should be reported to the Office of Student
          Discipline.
        </Text>

        <Text className="mt-6 border-t pt-4 text-center text-sm italic">
          By proceeding with this rental, you acknowledge that you have read,
          understood, and agreed to all the terms and conditions stated above.
        </Text>
      </Section>
    ) : null

  return (
    <Html>
      <Head>
        <title>{content[type]?.title || "Notification"}</title>
      </Head>
      <Preview>{content[type]?.preview}</Preview>
      <Tailwind>
        <Body className="py-12">
          <Container className="mx-auto size-full max-w-[800px] rounded-xl border bg-white p-8 shadow-xl">
            <Section className="text-center">
              <Img
                src={logoUrl}
                width="100"
                height="100"
                alt="Logo"
                className="mx-auto mt-10 mb-8 rounded-xl"
              />
              <Text className="m-0 mb-6 text-center font-bold text-3xl text-gray-800">
                {content[type]?.title}
              </Text>
              <Text className="mb-4 text-center font-medium text-gray-700 text-xl">
                {recipientName ? `Hi ${recipientName}! 👋` : "Hi! 👋"}
              </Text>
              <Text className="m-5 text-center text-base text-gray-600">
                {content[type]?.subtitle}
              </Text>
            </Section>

            {type.includes("rental") || type === "payment-reminder" ? (
              renderLockerContent()
            ) : type === "otp" ? (
              <Section className="mb-8 text-center">
                <Text className="m-0 text-center font-bold text-4xl text-black tracking-wide">
                  {token}
                </Text>
              </Section>
            ) : (
              <Section className="mb-8 text-center">
                <Button
                  className="inline-block rounded-lg bg-black px-8 py-4 font-semibold text-base text-white shadow-lg"
                  href={URL}
                >
                  {content[type]?.buttonText}
                </Button>
              </Section>
            )}

            {rentalTerms}

            {type !== "otp" &&
              !type.includes("rental") &&
              type !== "payment-reminder" && (
                <Section className="text-center">
                  <Text className="m-1 text-gray-500 text-xs">
                    Button not working? Copy and paste this URL into your
                    browser:
                  </Text>
                  <Link href={URL} className="mt-2 break-all text-xs underline">
                    {URL}
                  </Link>
                </Section>
              )}

            <Hr className="my-8" />

            <Section className="mb-2">
              <Text className="m-5 mb-5 text-justify text-gray-600 text-xs">
                For your security, we never ask for your password, financial
                details, or sensitive information via email.{" "}
                {content[type]?.disclaimer}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
