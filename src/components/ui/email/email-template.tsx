import {
  Hr,
  Img,
  Html,
  Head,
  Body,
  Text,
  Link,
  Button,
  Preview,
  Section,
  Container,
  Tailwind,
} from "@react-email/components"
import { env } from "@/config/env"

interface EmailTemplateProps {
  token: string
  email: string
  type?: "verify" | "reset-password" | "otp"
}

export function EmailTemplate({
  token,
  email,
  type = "verify",
}: EmailTemplateProps) {
  const encodedToken = encodeURIComponent(token)
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
      disclaimer:
        "This OTP will expire in 5 minutes. If you didn't request this code, please ignore this email or contact support.",
    },
  }

  return (
    <Html>
      <Head>
        <title>
          {type === "otp"
            ? "Sign In OTP"
            : type === "verify"
              ? "Email Verification"
              : "Password Reset"}
        </title>
      </Head>
      <Preview>{content[type].preview}</Preview>
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
                {content[type].title}
              </Text>
              <Text className="mb-4 text-center font-medium text-gray-700 text-xl">
                Hi! 👋
              </Text>
              <Text className="m-5 text-center text-base text-gray-600">
                {content[type].subtitle}
              </Text>
            </Section>

            {type === "otp" ? (
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
                  {content[type].buttonText}
                </Button>
              </Section>
            )}

            {type !== "otp" && (
              <Section className="text-center">
                <Text className="m-1 text-gray-500 text-xs">
                  Button not working? Copy and paste this URL into your browser:
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
                {content[type].disclaimer}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
