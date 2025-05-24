"use client"

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/cards"
import { SignInOtpAuthenticatorForm } from "@/features/auth/sign-in/otp-auth-signin-form"
import { SignInOTPEmailForm } from "@/features/auth/sign-in/otp-email-signin-form"
import { SignInEmailForm } from "@/features/auth/sign-in/email-signin-form"
import Image from "next/image"

import { useOtpStore } from "@/hooks/use-otp-store"

interface SignInClientProps {
  userId?: string
}

const SignInClient = ({ userId }: SignInClientProps) => {
  const isOtpSignIn = useOtpStore((state) => state.isOtpSignIn)

  const renderForm = () => {
    if (userId && isOtpSignIn) {
      return <SignInOtpAuthenticatorForm userId={userId} />
    }
    return isOtpSignIn ? <SignInOTPEmailForm /> : <SignInEmailForm />
  }

  return (
    <div className="flex w-full flex-col items-center justify-between gap-8 px-1">
      <Card className="w-full bg-background shadow-xl sm:w-96">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="DNSC Supreme Student Council Logo"
              width={100}
              height={100}
              className="rounded-full"
              priority
            />
          </div>
          <CardTitle className="text-center text-lg">
            {userId && isOtpSignIn
              ? "Enter Authenticator Code"
              : !isOtpSignIn
                ? "Welcome to IGPMIS"
                : "OTP Sign in"}
          </CardTitle>
          {/* <CardDescription className="text-center">
            {userId && isOtpSignIn
              ? "Enter the code from your authenticator app"
              : !isOtpSignIn
                ? "Welcome back! Please sign in to continue"
                : "Enter the OTP from your authenticator app"}
          </CardDescription> */}
        </CardHeader>
        <CardContent>{renderForm()}</CardContent>
      </Card>
    </div>
  )
}

export default SignInClient
